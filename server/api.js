// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const donationAPI = {
  createOrder: async (donationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  },

  getReceipt: async (donationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/${donationId}/receipt`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Get receipt error:', error);
      throw error;
    }
  }
};