// src/services/api.js - Fixed API Service for Instamojo
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

console.log('🔗 API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

// Test backend connection on load
const testBackendConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
    } else {
      console.warn('⚠️ Backend responded with error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
};

// Test connection when this module loads
testBackendConnection();

export const donationAPI = {
  createPaymentRequest: async (donationData) => {
    const url = `${API_BASE_URL}/api/donations/create-order`;
    console.log('📤 Creating Instamojo payment request:', { url, data: donationData });
    
    try {
      // Ensure proper data structure
      const requestData = {
        amount: parseFloat(donationData.amount),
        donorDetails: {
          name: donationData.donorDetails.name,
          email: donationData.donorDetails.email,
          phone: donationData.donorDetails.phone,
          address: donationData.donorDetails.address,
          city: donationData.donorDetails.city,
          pincode: donationData.donorDetails.pincode,
          cause: donationData.donorDetails.cause || 'general',
          panNumber: donationData.donorDetails.panNumber,
          isAnonymous: donationData.donorDetails.isAnonymous,
          wantReceipt: donationData.donorDetails.wantReceipt,
          comments: donationData.donorDetails.comments
        }
      };

      console.log('📦 Sending request data:', requestData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('📥 Create payment request response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create payment request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText} - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ Payment request created successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Create payment request error:', error);
      
      // Provide helpful error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to payment server. Please check if the backend is running on http://localhost:5001');
      } else if (error.message.includes('CORS')) {
        throw new Error('Cross-origin request blocked. Please restart the backend server.');
      } else {
        throw new Error(`Payment setup failed: ${error.message}`);
      }
    }
  },

  // Redirect to Instamojo payment page
  redirectToPayment: (paymentUrl) => {
    console.log('🔄 Redirecting to Instamojo payment page:', paymentUrl);
    window.location.href = paymentUrl;
  },

  verifyPayment: async (paymentData) => {
    const url = `${API_BASE_URL}/api/donations/verify-payment`;
    console.log('📤 Verifying payment:', { url, paymentId: paymentData.payment_id });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      console.log('📥 Verify payment response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Payment verification failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Verification failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Payment verified successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      throw error;
    }
  },

  getReceipt: async (donationId) => {
    const url = `${API_BASE_URL}/api/donations/${donationId}/receipt`;
    console.log('📤 Getting receipt:', { url, donationId });
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Receipt fetch failed: ${response.statusText}`);
      }
      
      const result = await response.blob();
      console.log('✅ Receipt downloaded successfully');
      return result;
      
    } catch (error) {
      console.error('❌ Receipt download error:', error);
      throw error;
    }
  },

  // Parse URL parameters after payment redirect
  parsePaymentResponse: () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      payment_id: urlParams.get('payment_id'),
      payment_status: urlParams.get('payment_status'),
      payment_request_id: urlParams.get('payment_request_id')
    };
  },

  // Check if current page is payment success page
  isPaymentSuccessPage: () => {
    return window.location.pathname.includes('donation-success') || 
           window.location.search.includes('payment_id');
  },

  // Health check function
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

// Legacy support - keep the old function name but map to new Instamojo function
export const createOrder = donationAPI.createPaymentRequest;

// Export for debugging
window.donationAPI = donationAPI;
window.API_BASE_URL = API_BASE_URL;