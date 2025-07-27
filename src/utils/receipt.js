const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function generateReceipt(donation) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    const receiptHTML = generateReceiptHTML(donation);
    await page.setContent(receiptHTML);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function generateReceiptHTML(donation) {
  const date = new Date(donation.created_at).toLocaleDateString('en-IN');
  const taxBenefit = Math.floor(donation.amount * 0.5);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Donation Receipt - ${donation.donation_id}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #16a34a;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          background: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        .org-name {
          font-size: 28px;
          font-weight: bold;
          color: #16a34a;
          margin: 10px 0;
        }
        .tagline {
          font-style: italic;
          color: #059669;
          margin-bottom: 10px;
        }
        .receipt-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .receipt-number {
          background: #f0fdf4;
          padding: 10px;
          border-left: 4px solid #16a34a;
          margin: 20px 0;
          font-weight: bold;
        }
        .donation-details {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px dotted #d1d5db;
        }
        .detail-label {
          font-weight: bold;
          color: #374151;
        }
        .detail-value {
          color: #1f2937;
        }
        .amount {
          font-size: 24px;
          font-weight: bold;
          color: #16a34a;
        }
        .tax-info {
          background: #dbeafe;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #3b82f6;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          text-align: center;
          width: 200px;
        }
        .signature-line {
          border-top: 1px solid #333;
          margin-top: 60px;
          padding-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">S</div>
        <div class="org-name">SAHAYAA TRUST</div>
        <div class="tagline">"The one who stands with you"</div>
        <div class="receipt-title">Donation Receipt</div>
      </div>

      <div class="receipt-number">
        Receipt Number: ${donation.donation_id} | Date: ${date}
      </div>

      <div class="donation-details">
        <div class="detail-row">
          <span class="detail-label">Donor Name:</span>
          <span class="detail-value">${donation.donor_name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${donation.donor_email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${donation.donor_phone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Address:</span>
          <span class="detail-value">${donation.donor_address}, ${donation.donor_city} - ${donation.donor_pincode}</span>
        </div>
        ${donation.pan_number ? `
        <div class="detail-row">
          <span class="detail-label">PAN Number:</span>
          <span class="detail-value">${donation.pan_number}</span>
        </div>
        ` : ''}
        <div class="detail-row">
          <span class="detail-label">Donation Purpose:</span>
          <span class="detail-value">${donation.cause}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Donation Amount:</span>
          <span class="detail-value amount">₹${parseFloat(donation.amount).toLocaleString('en-IN')}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Method:</span>
          <span class="detail-value">${donation.payment_method || 'Online'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transaction ID:</span>
          <span class="detail-value">${donation.razorpay_payment_id}</span>
        </div>
      </div>

      <div class="tax-info">
        <h3 style="margin-top: 0; color: #1e40af;">Tax Exemption Information</h3>
        <p><strong>80G Registration:</strong> Available (Section 80G of Income Tax Act, 1961)</p>
        <p><strong>Eligible Deduction:</strong> ₹${taxBenefit.toLocaleString('en-IN')} (50% of donation amount)</p>
        <p><strong>Note:</strong> This receipt is valid for claiming tax exemption under Section 80G. Please preserve this receipt for your tax records.</p>
      </div>

      ${donation.comments ? `
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Donor Message:</h4>
        <p style="font-style: italic;">"${donation.comments}"</p>
      </div>
      ` : ''}

      <div class="signature-section">
        <div class="signature">
          <div class="signature-line">Program Director</div>
        </div>
        <div class="signature">
          <div class="signature-line">Authorized Signatory</div>
        </div>
      </div>

      <div class="footer">
        <p><strong>Sahayaa Trust</strong></p>
        <p>Community Service Center, Hyderabad, Telangana, India</p>
        <p>Email: donations@sahayaa.org | Phone: +91 98765 43210</p>
        <p>This is a computer generated receipt and does not require physical signature.</p>
        <p>Certificate generated on ${new Date().toLocaleString('en-IN')}</p>
      </div>
    </body>
    </html>
  `;
}

async function sendReceiptEmail(donation, receiptBuffer) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: donation.donor_email,
    subject: `Thank you for your donation - Receipt ${donation.donation_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Donation!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sahayaa Trust - "The one who stands with you"</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Dear ${donation.donor_name},</p>
          
          <p style="color: #555; line-height: 1.6;">
            We are deeply grateful for your generous donation of <strong>₹${parseFloat(donation.amount).toLocaleString('en-IN')}</strong> 
            towards <strong>${donation.cause}</strong>. Your contribution will make a meaningful difference in our community.
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="color: #16a34a; margin-top: 0;">Donation Details</h3>
            <p style="margin: 5px 0;"><strong>Receipt Number:</strong> ${donation.donation_id}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(donation.created_at).toLocaleDateString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${parseFloat(donation.amount).toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Tax Benefit:</strong> ₹${Math.floor(donation.amount * 0.5).toLocaleString('en-IN')} (approx.)</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Your 80G tax exemption receipt is attached to this email. Please keep this receipt safe for your tax filing records.
          </p>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1e40af; margin-top: 0;">What happens next?</h4>
            <ul style="color: #1e40af; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Your donation will be allocated within 48 hours</li>
              <li>You'll receive quarterly impact reports</li>
              <li>Track your donation impact on our website</li>
            </ul>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for being part of our mission to build a compassionate society. Together, we are making a difference!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #888; font-size: 14px;">
              With gratitude,<br>
              <strong>The Sahayaa Trust Team</strong>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>Sahayaa Trust | Community Service Center, Hyderabad, Telangana</p>
          <p>Email: donations@sahayaa.org | Phone: +91 98765 43210</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `sahayaa-receipt-${donation.donation_id}.pdf`,
        content: receiptBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  generateReceipt,
  sendReceiptEmail
};