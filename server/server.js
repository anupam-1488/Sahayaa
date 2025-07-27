const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Make sure this is 5001, not 5000

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend working!' });
});

app.post('/api/donations/create-order', (req, res) => {
  console.log('Creating order:', req.body);
  res.json({
    success: true,
    orderId: `order_${Date.now()}`,
    donationId: `DON${Date.now()}`,
    amount: req.body.amount * 100,
    currency: 'INR'
  });
});

app.post('/api/donations/verify-payment', (req, res) => {
  console.log('Verifying payment:', req.body);
  res.json({
    success: true,
    donationId: `DON${Date.now()}`,
    message: 'Payment verified successfully'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});