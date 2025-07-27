const express = require('express');
const crypto = require('crypto');
const { supabase, razorpay } = require('../server');
const { generateReceipt, sendReceiptEmail } = require('../utils/receipt');

const router = express.Router();

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const {
      amount,
      currency = 'INR',
      donorDetails
    } = req.body;

    // Validate amount
    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        error: 'Minimum donation amount is ₹10'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: `donation_${Date.now()}`,
      notes: {
        donor_name: donorDetails.name,
        donor_email: donorDetails.email,
        cause: donorDetails.cause
      }
    };

    const order = await razorpay.orders.create(options);

    // Generate donation ID
    const donationId = `DON${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Save preliminary donation record
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        donation_id: donationId,
        donor_name: donorDetails.name,
        donor_email: donorDetails.email,
        donor_phone: donorDetails.phone,
        donor_address: donorDetails.address,
        donor_city: donorDetails.city,
        donor_pincode: donorDetails.pincode,
        pan_number: donorDetails.panNumber || null,
        amount: amount,
        cause: donorDetails.cause,
        comments: donorDetails.comments || null,
        is_anonymous: donorDetails.isAnonymous || false,
        want_receipt: donorDetails.wantReceipt || true,
        razorpay_order_id: order.id,
        payment_status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create donation record'
      });
    }

    res.json({
      success: true,
      orderId: order.id,
      donationId: donationId,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donorDetails
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update donation record
    const { data, error } = await supabase
      .from('donations')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        payment_status: 'completed',
        payment_method: payment.method,
        payment_date: new Date(payment.created_at * 1000).toISOString(),
        status: 'completed'
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select();

    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update donation record'
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Donation record not found'
      });
    }

    const donation = data[0];

    // Generate receipt if requested
    if (donation.want_receipt) {
      try {
        await generateAndSendReceipt(donation);
      } catch (receiptError) {
        console.error('Receipt generation error:', receiptError);
        // Don't fail the payment verification for receipt errors
      }
    }

    res.json({
      success: true,
      donationId: donation.donation_id,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

// Get donation receipt
router.get('/:donationId/receipt', async (req, res) => {
  try {
    const { donationId } = req.params;

    // Get donation details
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donation_id', donationId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found'
      });
    }

    // Generate receipt PDF
    const receiptBuffer = await generateReceipt(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="sahayaa-receipt-${donationId}.pdf"`);
    res.send(receiptBuffer);

  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate receipt'
    });
  }
});

// Get donation statistics
router.get('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('amount, cause, created_at')
      .eq('payment_status', 'completed');

    if (error) {
      throw error;
    }

    const stats = {
      totalDonations: data.length,
      totalAmount: data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0),
      averageDonation: data.length > 0 ? data.reduce((sum, donation) => sum + parseFloat(donation.amount), 0) / data.length : 0,
      topCauses: getTopCauses(data),
      monthlyTrend: getMonthlyTrend(data)
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donation statistics'
    });
  }
});

// Helper function to generate and send receipt
async function generateAndSendReceipt(donation) {
  try {
    // Generate receipt PDF
    const receiptBuffer = await generateReceipt(donation);
    
    // Save receipt record
    const receiptNumber = `RCP${Date.now()}`;
    
    await supabase
      .from('donation_receipts')
      .insert([{
        donation_id: donation.id,
        receipt_number: receiptNumber
      }]);

    // Send receipt email
    await sendReceiptEmail(donation, receiptBuffer);

    // Update donation record
    await supabase
      .from('donations')
      .update({
        receipt_generated: true,
        receipt_sent: true
      })
      .eq('id', donation.id);

  } catch (error) {
    console.error('Receipt generation/sending error:', error);
    throw error;
  }
}

// Helper functions
function getTopCauses(donations) {
  const causeCounts = donations.reduce((acc, donation) => {
    acc[donation.cause] = (acc[donation.cause] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(causeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([cause, count]) => ({ cause, count }));
}

function getMonthlyTrend(donations) {
  const monthly = donations.reduce((acc, donation) => {
    const month = new Date(donation.created_at).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + parseFloat(donation.amount);
    return acc;
  }, {});

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));
}

module.exports = router;