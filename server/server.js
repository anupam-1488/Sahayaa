// server/server.js - Fixed with Better Error Handling and CORS
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');

// Load environment variables from the parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Enhanced middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Debug environment variables
console.log('\n🔍 Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('INSTAMOJO_API_KEY:', process.env.REACT_APP_INSTAMOJO_API_KEY ? 'LOADED' : '❌ MISSING');
console.log('INSTAMOJO_AUTH_TOKEN:', process.env.INSTAMOJO_AUTH_TOKEN ? 'LOADED' : '❌ MISSING');
console.log('INSTAMOJO_API_URL:', process.env.INSTAMOJO_API_URL || 'Using default');

// Validate required environment variables
const requiredEnvVars = {
  'REACT_APP_INSTAMOJO_API_KEY': process.env.REACT_APP_INSTAMOJO_API_KEY,
  'INSTAMOJO_AUTH_TOKEN': process.env.INSTAMOJO_AUTH_TOKEN
};

let missingVars = [];
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.error('\n❌ MISSING ENVIRONMENT VARIABLES:');
  missingVars.forEach(varName => {
    console.error(`   ${varName}`);
  });
  console.error('\n💡 Please check your .env file in the project root contains:');
  console.error('   REACT_APP_INSTAMOJO_API_KEY=test_your_api_key_here');
  console.error('   INSTAMOJO_AUTH_TOKEN=test_your_auth_token_here');
  console.error('   INSTAMOJO_API_URL=https://test.instamojo.com/api/1.1/');
  console.error('\n🔧 Get these from: https://www.instamojo.com/developers/');
  
  // Don't exit in development to allow debugging
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Instamojo configuration
const INSTAMOJO_CONFIG = {
  apiKey: process.env.REACT_APP_INSTAMOJO_API_KEY,
  authToken: process.env.INSTAMOJO_AUTH_TOKEN,
  apiUrl: process.env.INSTAMOJO_API_URL || 'https://test.instamojo.com/api/1.1/',
  salt: process.env.INSTAMOJO_SALT
};

console.log('✅ Instamojo configuration loaded');

// Enhanced test endpoint
app.get('/api/test', (req, res) => {
  const response = {
    message: 'Sahayaa Trust Backend API Working with Instamojo!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: {
      port: PORT,
      cors: 'enabled',
      middleware: 'loaded'
    },
    instamojo: {
      apiKey: process.env.REACT_APP_INSTAMOJO_API_KEY ? `${process.env.REACT_APP_INSTAMOJO_API_KEY.substring(0, 12)}...` : '❌ Missing',
      authToken: process.env.INSTAMOJO_AUTH_TOKEN ? 'Loaded ✅' : '❌ Missing',
      apiUrl: INSTAMOJO_CONFIG.apiUrl,
      configured: !!(process.env.REACT_APP_INSTAMOJO_API_KEY && process.env.INSTAMOJO_AUTH_TOKEN)
    }
  };
  
  console.log('📋 Test endpoint called:', req.ip);
  res.json(response);
});

// Create Instamojo Payment Request with enhanced error handling
app.post('/api/donations/create-order', async (req, res) => {
  try {
    console.log('📝 Creating Instamojo payment request...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { amount, donorDetails } = req.body;

    // Enhanced validation
    const errors = [];
    if (!amount || isNaN(amount) || amount < 10) {
      errors.push('Amount must be at least ₹10');
    }
    if (!donorDetails) {
      errors.push('Donor details are required');
    } else {
      if (!donorDetails.name?.trim()) errors.push('Donor name is required');
      if (!donorDetails.email?.trim()) errors.push('Donor email is required');
      if (!donorDetails.phone?.trim()) errors.push('Donor phone is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Check Instamojo configuration
    if (!INSTAMOJO_CONFIG.apiKey || !INSTAMOJO_CONFIG.authToken) {
      return res.status(500).json({
        success: false,
        error: 'Instamojo not configured properly',
        details: 'Missing API credentials in environment variables'
      });
    }

    // Generate unique payment request ID
    const donationId = `SAH${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Prepare Instamojo Payment Request data
    const paymentData = {
      purpose: `Donation to Sahayaa Trust - ${donorDetails.cause || 'General Fund'}`,
      amount: parseFloat(amount),
      phone: donorDetails.phone.replace(/\D/g, '').slice(-10), // Clean phone number
      buyer_name: donorDetails.name.trim(),
      redirect_url: `${req.protocol}://${req.get('host')}/api/donations/payment-success`,
      send_email: true,
      webhook: `${req.protocol}://${req.get('host')}/api/donations/webhook`,
      send_sms: false,
      email: donorDetails.email.trim(),
      allow_repeated_payments: false
    };

    console.log('🔄 Calling Instamojo API...');
    console.log('API URL:', `${INSTAMOJO_CONFIG.apiUrl}payment-requests/`);
    console.log('Payment data:', JSON.stringify(paymentData, null, 2));

    // Make API call to Instamojo with timeout
    const axiosConfig = {
      headers: {
        'X-Api-Key': INSTAMOJO_CONFIG.apiKey,
        'X-Auth-Token': INSTAMOJO_CONFIG.authToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 30000, // 30 second timeout
      transformRequest: [(data) => {
        return Object.keys(data)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
          .join('&');
      }]
    };

    const response = await axios.post(
      `${INSTAMOJO_CONFIG.apiUrl}payment-requests/`,
      paymentData,
      axiosConfig
    );

    console.log('📥 Instamojo API Response Status:', response.status);
    console.log('📥 Instamojo API Response:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      const paymentRequest = response.data.payment_request;
      
      console.log('✅ Payment request created successfully:', paymentRequest.id);

      res.json({
        success: true,
        paymentRequestId: paymentRequest.id,
        donationId: donationId,
        longUrl: paymentRequest.longurl,
        amount: paymentRequest.amount,
        status: paymentRequest.status,
        apiKey: process.env.REACT_APP_INSTAMOJO_API_KEY
      });

    } else {
      console.error('❌ Instamojo API returned success: false');
      console.error('Error details:', response.data);
      throw new Error(response.data.message || 'Instamojo API returned an error');
    }

  } catch (error) {
    console.error('❌ Create payment request error:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request was made but no response received');
      console.error('Request details:', error.request);
    }

    let errorMessage = 'Failed to create payment request';
    let statusCode = 500;

    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to Instamojo API. Check internet connection.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Request to Instamojo API timed out. Please try again.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid Instamojo API credentials. Check your API key and auth token.';
      statusCode = 401;
    } else if (error.response?.status === 400) {
      errorMessage = `Instamojo API validation error: ${error.response.data?.message || 'Invalid request data'}`;
      statusCode = 400;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status || 500;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.response?.data || error.message,
      debug: {
        errorType: error.constructor.name,
        hasResponse: !!error.response,
        status: error.response?.status,
        instamojo: {
          apiConfigured: !!(INSTAMOJO_CONFIG.apiKey && INSTAMOJO_CONFIG.authToken),
          apiUrl: INSTAMOJO_CONFIG.apiUrl
        }
      }
    });
  }
});

// Handle Payment Success Redirect
app.get('/api/donations/payment-success', async (req, res) => {
  try {
    const { payment_id, payment_status, payment_request_id } = req.query;
    
    console.log('✅ Payment success callback received:', {
      payment_id,
      payment_status,
      payment_request_id
    });

    // Redirect to frontend with payment details
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000';
    
    res.redirect(`${frontendUrl}/donation-success?payment_id=${payment_id}&payment_status=${payment_status}&payment_request_id=${payment_request_id}`);

  } catch (error) {
    console.error('❌ Payment success handling error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment success handling failed'
    });
  }
});

// Verify Payment Status with enhanced error handling
app.post('/api/donations/verify-payment', async (req, res) => {
  try {
    console.log('🔍 Verifying payment...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { payment_id, payment_request_id, donorDetails } = req.body;

    // Validate required fields
    if (!payment_id || !payment_request_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification data',
        required: ['payment_id', 'payment_request_id']
      });
    }

    // Get payment details from Instamojo
    try {
      console.log('🔍 Fetching payment details from Instamojo...');
      const response = await axios.get(
        `${INSTAMOJO_CONFIG.apiUrl}payments/${payment_id}/`,
        {
          headers: {
            'X-Api-Key': INSTAMOJO_CONFIG.apiKey,
            'X-Auth-Token': INSTAMOJO_CONFIG.authToken
          },
          timeout: 15000
        }
      );

      console.log('📥 Payment details response:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        const payment = response.data.payment;
        
        console.log('💳 Payment details:', {
          id: payment.payment_id,
          amount: payment.amount,
          status: payment.status,
          fees: payment.fees
        });

        // Verify payment status
        if (payment.status !== 'Credit') {
          return res.status(400).json({
            success: false,
            error: `Payment not completed. Status: ${payment.status}`,
            paymentStatus: payment.status
          });
        }

        // Generate final donation ID
        const donationId = `SAH${Date.now()}${Math.floor(Math.random() * 1000)}`;

        console.log('✅ Payment verified successfully:', donationId);

        res.json({
          success: true,
          donationId: donationId,
          message: 'Payment verified successfully',
          amount: parseFloat(payment.amount),
          paymentDetails: {
            payment_id: payment.payment_id,
            fees: payment.fees || 0,
            currency: payment.currency,
            status: payment.status,
            instrument_type: payment.instrument_type,
            billing_instrument: payment.billing_instrument
          }
        });

      } else {
        throw new Error(response.data.message || 'Failed to fetch payment details');
      }

    } catch (paymentError) {
      console.error('❌ Error fetching payment details:', paymentError.response?.data || paymentError.message);
      
      let errorMessage = 'Failed to verify payment details with Instamojo';
      if (paymentError.response?.status === 404) {
        errorMessage = 'Payment not found. Please check the payment ID.';
      } else if (paymentError.response?.status === 401) {
        errorMessage = 'Invalid API credentials for payment verification.';
      }
      
      return res.status(500).json({
        success: false,
        error: errorMessage,
        details: paymentError.response?.data || paymentError.message
      });
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed: ' + error.message
    });
  }
});

// Instamojo Webhook Handler
app.post('/api/donations/webhook', (req, res) => {
  try {
    console.log('🔔 Webhook received from Instamojo:', req.body);

    // Verify webhook signature if salt is provided
    if (INSTAMOJO_CONFIG.salt) {
      const mac = req.headers['x-instamojo-signature'];
      const body = JSON.stringify(req.body);
      const expectedMac = crypto
        .createHmac('sha1', INSTAMOJO_CONFIG.salt)
        .update(body)
        .digest('hex');

      if (mac !== expectedMac) {
        console.error('❌ Invalid webhook signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    // Process webhook data
    const { payment, payment_request } = req.body;
    
    if (payment && payment.status === 'Credit') {
      console.log('✅ Payment completed via webhook:', payment.payment_id);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get donation receipt (placeholder)
app.get('/api/donations/:donationId/receipt', (req, res) => {
  const { donationId } = req.params;
  
  console.log('📄 Receipt requested for:', donationId);
  
  res.json({
    success: true,
    message: 'Receipt generation will be implemented soon',
    donationId: donationId
  });
});

// Health check with detailed info
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: {
      port: PORT,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    },
    instamojo: {
      configured: !!(process.env.REACT_APP_INSTAMOJO_API_KEY && process.env.INSTAMOJO_AUTH_TOKEN),
      apiUrl: INSTAMOJO_CONFIG.apiUrl,
      apiKey: process.env.REACT_APP_INSTAMOJO_API_KEY ? 'Present' : 'Missing',
      authToken: process.env.INSTAMOJO_AUTH_TOKEN ? 'Present' : 'Missing'
    }
  };
  
  res.json(health);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('🔍 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /api/test',
      'GET /health',
      'POST /api/donations/create-order',
      'POST /api/donations/verify-payment',
      'GET /api/donations/payment-success',
      'POST /api/donations/webhook',
      'GET /api/donations/:id/receipt'
    ]
  });
});

// Start server with detailed logging
app.listen(PORT, () => {
  console.log('\n🚀 Sahayaa Trust Backend Server Started with Instamojo!');
  console.log('═'.repeat(60));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${process.env.REACT_APP_INSTAMOJO_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log(`🔐 Auth Token: ${process.env.INSTAMOJO_AUTH_TOKEN ? '✅ Loaded' : '❌ Missing'}`);
  console.log(`🌐 API URL: ${INSTAMOJO_CONFIG.apiUrl}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('═'.repeat(60));
  console.log('📋 Available endpoints:');
  console.log('  GET  /api/test          - Test connection');
  console.log('  GET  /health            - Health check');
  console.log('  POST /api/donations/create-order    - Create payment');
  console.log('  POST /api/donations/verify-payment  - Verify payment');
  console.log('  GET  /api/donations/payment-success - Payment redirect');
  console.log('  POST /api/donations/webhook         - Instamojo webhook');
  console.log('  GET  /api/donations/:id/receipt     - Download receipt');
  console.log('═'.repeat(60));
  
  if (!process.env.REACT_APP_INSTAMOJO_API_KEY || !process.env.INSTAMOJO_AUTH_TOKEN) {
    console.log('⚠️  WARNING: Missing Instamojo credentials!');
    console.log('   Add these to your .env file:');
    console.log('   REACT_APP_INSTAMOJO_API_KEY=test_your_api_key');
    console.log('   INSTAMOJO_AUTH_TOKEN=test_your_auth_token');
    console.log('═'.repeat(60));
  }
  
  console.log('✅ Server ready for requests!\n');
});