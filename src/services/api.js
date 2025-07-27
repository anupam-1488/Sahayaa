const API_BASE_URL = 'http://localhost:5001'; // Changed to 5001

export const donationAPI = {
  createOrder: async (donationData) => {
    const response = await fetch(`${API_BASE_URL}/api/donations/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
    });
    return response.json();
  },

  verifyPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/api/donations/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  getReceipt: async (donationId) => {
    const response = await fetch(`${API_BASE_URL}/api/donations/${donationId}/receipt`);
    return response.blob();
  }
};