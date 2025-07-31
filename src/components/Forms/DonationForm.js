// src/components/Forms/DonationForm.js - Updated for Instamojo Integration
import React, { useState, useEffect } from 'react';
import { X, CreditCard, User, Mail, Phone, MapPin, Download, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Modal from '../UI/Modal';
import { donationAPI } from '../../services/api';

const DonationForm = ({ show, onClose, amount, cause }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Processing, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [donationId, setDonationId] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    panNumber: '',
    amount: amount || '',
    cause: cause?.id || 'general',
    isAnonymous: false,
    wantReceipt: true,
    comments: ''
  });

  // Check if we're returning from payment
  useEffect(() => {
    if (show && donationAPI.isPaymentSuccessPage()) {
      const paymentData = donationAPI.parsePaymentResponse();
      if (paymentData.payment_id) {
        handlePaymentReturn(paymentData);
      }
    }
  }, [show]);

  // Update amount when prop changes
  useEffect(() => {
    if (amount) {
      setFormData(prev => ({ ...prev, amount: amount }));
    }
  }, [amount]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!isValidEmail(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
    if (!formData.amount || formData.amount < 10) errors.amount = 'Minimum donation is ₹10';
    
    // PAN validation for tax exemption
    if (formData.wantReceipt && formData.amount >= 2000 && !formData.panNumber.trim()) {
      errors.panNumber = 'PAN number required for donations above ₹2000';
    }
    
    if (formData.panNumber && !isValidPAN(formData.panNumber)) {
      errors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    return errors;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPAN = (pan) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    setError('');
    setStep(2);
    
    // Initiate payment
    await initiatePayment();
  };

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      console.log('🚀 Initiating Instamojo payment for:', formData);

      // Test backend connection first
      const testResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'}/api/test`);
      if (!testResponse.ok) {
        throw new Error('Backend server not responding. Please ensure the server is running.');
      }
      
      const testData = await testResponse.json();
      console.log('🔗 Backend connection test:', testData);

      // Create payment request on backend
      const paymentResponse = await donationAPI.createPaymentRequest({
        amount: parseFloat(formData.amount),
        donorDetails: formData
      });
      
      console.log('📦 Payment request response:', paymentResponse);

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Failed to create payment request');
      }

      // Store payment URL and donation ID
      setPaymentUrl(paymentResponse.longUrl);
      setDonationId(paymentResponse.donationId);

      // Store form data in localStorage for after payment return
      localStorage.setItem('sahayaa_donation_form', JSON.stringify(formData));
      localStorage.setItem('sahayaa_donation_id', paymentResponse.donationId);

      console.log('✅ Payment request created, redirecting to Instamojo...');
      
    } catch (error) {
      console.error('❌ Payment initiation error:', error);
      setError(`Payment setup failed: ${error.message}`);
      setLoading(false);
      setStep(1);
    }
  };

  const redirectToPayment = () => {
    if (paymentUrl) {
      console.log('🔄 Redirecting to Instamojo payment page...');
      window.location.href = paymentUrl;
    }
  };

  const handlePaymentReturn = async (paymentData) => {
    setLoading(true);
    setStep(2);
    
    try {
      console.log('🔍 Processing payment return:', paymentData);

      // Get stored form data
      const storedFormData = localStorage.getItem('sahayaa_donation_form');
      const storedDonationId = localStorage.getItem('sahayaa_donation_id');
      
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }
      
      if (storedDonationId) {
        setDonationId(storedDonationId);
      }

      // Verify payment with backend
      const verificationResponse = await donationAPI.verifyPayment({
        payment_id: paymentData.payment_id,
        payment_request_id: paymentData.payment_request_id,
        donorDetails: JSON.parse(storedFormData || '{}')
      });
      
      console.log('✅ Verification response:', verificationResponse);

      if (verificationResponse.success) {
        setDonationId(verificationResponse.donationId);
        setStep(3);
        setError('');
        
        // Clear stored data
        localStorage.removeItem('sahayaa_donation_form');
        localStorage.removeItem('sahayaa_donation_id');
        
        console.log('📧 Payment verified, donation ID:', verificationResponse.donationId);
        
      } else {
        throw new Error(verificationResponse.error || 'Payment verification failed');
      }
      
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      setError(`Payment verification failed: ${error.message}. Please contact support with payment ID: ${paymentData.payment_id}`);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getReceipt(donationId);
      
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sahayaa-donation-receipt-${donationId}.pdf`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Receipt download error:', error);
      alert('Receipt download is not yet available. You will receive it via email.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setError('');
    setDonationId('');
    setPaymentUrl('');
    setLoading(false);
    onClose();
  };

  if (!show) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-800">
            {step === 1 && 'Donation Details'}
            {step === 2 && 'Processing Payment'}
            {step === 3 && 'Thank You!'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            disabled={loading && step === 2}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepNumber ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > stepNumber ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-medium">Payment Error</h4>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Donation Details */}
        {step === 1 && (
          <DonorDetailsForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            cause={cause}
          />
        )}

        {/* Step 2: Payment Processing */}
        {step === 2 && (
          <PaymentProcessing 
            loading={loading}
            paymentUrl={paymentUrl}
            redirectToPayment={redirectToPayment}
          />
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <DonationSuccess 
            formData={formData}
            donationId={donationId}
            onDownloadReceipt={downloadReceipt}
            onClose={handleClose}
            loading={loading}
          />
        )}
      </div>
    </Modal>
  );
};

const DonorDetailsForm = ({ formData, setFormData, onSubmit, loading, cause }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {/* Donation Summary */}
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 className="font-semibold text-green-800 mb-2">Donation Summary</h4>
      <div className="flex justify-between items-center">
        <span className="text-green-700">
          {cause?.title || 'General Fund'} - ₹{formData.amount ? parseFloat(formData.amount).toLocaleString() : '0'}
        </span>
        <span className="text-green-600 text-sm">
          Tax benefit: ₹{formData.amount ? Math.floor(formData.amount * 0.5).toLocaleString() : '0'}
        </span>
      </div>
    </div>

    {/* Payment Method Info */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <ExternalLink className="w-5 h-5 text-blue-600" />
        <span className="text-blue-800 font-medium">Payment via Instamojo</span>
      </div>
      <p className="text-blue-700 text-sm mt-1">
        You will be redirected to Instamojo's secure payment page to complete your donation.
      </p>
    </div>

    {/* Personal Details */}
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        label="Full Name"
        type="text"
        value={formData.name}
        onChange={(value) => setFormData({...formData, name: value})}
        placeholder="Enter your full name"
        icon={User}
        required
      />
      <FormField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({...formData, email: value})}
        placeholder="your.email@example.com"
        icon={Mail}
        required
      />
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(value) => setFormData({...formData, phone: value})}
        placeholder="+91 98765 43210"
        icon={Phone}
        required
      />
      <FormField
        label="PAN Number"
        type="text"
        value={formData.panNumber}
        onChange={(value) => setFormData({...formData, panNumber: value.toUpperCase()})}
        placeholder="ABCDE1234F"
        helpText={formData.amount >= 2000 ? "Required for tax exemption" : "Optional for tax exemption"}
        required={formData.wantReceipt && formData.amount >= 2000}
      />
    </div>

    {/* Address */}
    <FormField
      label="Address"
      type="textarea"
      value={formData.address}
      onChange={(value) => setFormData({...formData, address: value})}
      placeholder="Complete address"
      icon={MapPin}
      required
    />

    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        label="City"
        type="text"
        value={formData.city}
        onChange={(value) => setFormData({...formData, city: value})}
        placeholder="City"
        required
      />
      <FormField
        label="Pincode"
        type="text"
        value={formData.pincode}
        onChange={(value) => setFormData({...formData, pincode: value})}
        placeholder="123456"
        required
      />
    </div>

    {/* Donation Amount */}
    <FormField
      label="Donation Amount (₹)"
      type="number"
      value={formData.amount}
      onChange={(value) => setFormData({...formData, amount: value})}
      placeholder="100"
      required
      min="10"
      helpText="Minimum donation: ₹10"
    />

    {/* Preferences */}
    <div className="space-y-4">
      <CheckboxField
        label="I want to receive 80G tax exemption receipt"
        checked={formData.wantReceipt}
        onChange={(checked) => setFormData({...formData, wantReceipt: checked})}
      />
      
      <CheckboxField
        label="Make this donation anonymous"
        checked={formData.isAnonymous}
        onChange={(checked) => setFormData({...formData, isAnonymous: checked})}
        helpText="Your name will not be displayed in public donor lists"
      />
    </div>

    {/* Comments */}
    <FormField
      label="Message (Optional)"
      type="textarea"
      value={formData.comments}
      onChange={(value) => setFormData({...formData, comments: value})}
      placeholder="Any message or dedication for this donation..."
      rows={3}
    />

    {/* Submit */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-semibold text-lg"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>Proceed to Payment</span>
        </>
      )}
    </button>
  </form>
);

const PaymentProcessing = ({ loading, paymentUrl, redirectToPayment }) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      {loading ? (
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <ExternalLink className="w-10 h-10 text-green-600" />
      )}
    </div>
    
    <h3 className="text-xl font-bold text-gray-800 mb-4">
      {loading ? 'Setting up Payment...' : 'Ready to Proceed'}
    </h3>
    
    <p className="text-gray-600 mb-6">
      {loading 
        ? 'Please wait while we prepare your secure payment with Instamojo.'
        : 'Click the button below to complete your donation on Instamojo\'s secure payment page.'
      }
    </p>
    
    {paymentUrl && !loading && (
      <button
        onClick={redirectToPayment}
        className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto font-semibold text-lg"
      >
        <ExternalLink className="w-5 h-5" />
        <span>Continue to Payment</span>
      </button>
    )}
    
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
      <p className="text-blue-700 text-sm">
        🔒 Your payment is secured by Instamojo with industry-standard encryption. 
        You will be redirected back here after completing the payment.
      </p>
    </div>
  </div>
);

const DonationSuccess = ({ formData, donationId, onDownloadReceipt, onClose, loading }) => (
  <div className="text-center py-8">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-12 h-12 text-green-600" />
    </div>
    
    <h3 className="text-2xl font-bold text-green-800 mb-4">
      Thank You for Your Donation!
    </h3>
    
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <p className="text-green-800 font-semibold mb-2">
        Donation ID: {donationId}
      </p>
      <p className="text-green-700">
        Amount: ₹{formData.amount ? parseFloat(formData.amount).toLocaleString() : '0'} for {formData.cause}
      </p>
      <p className="text-green-600 text-sm mt-2">
        Tax Benefit: ₹{formData.amount ? Math.floor(formData.amount * 0.5).toLocaleString() : '0'} (approx.)
      </p>
    </div>

    <div className="space-y-4 mb-6">
      <p className="text-gray-600">
        Your donation will help us continue our mission of building a compassionate society. 
        A confirmation email has been sent to {formData.email}.
      </p>
      
      {formData.wantReceipt && (
        <button
          onClick={onDownloadReceipt}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{loading ? 'Generating...' : 'Download Receipt'}</span>
        </button>
      )}
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-yellow-800 mb-2">What happens next?</h4>
      <ul className="text-yellow-700 text-sm space-y-1 text-left">
        <li>• Your donation will be allocated to the selected cause within 48 hours</li>
        <li>• You'll receive quarterly impact reports via email</li>
        <li>• Tax receipt will be processed within 2-3 business days</li>
        <li>• You can track donation usage on our transparency portal</li>
      </ul>
    </div>

    <div className="flex space-x-4">
      <button
        onClick={onClose}
        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Close
      </button>
      <button
        onClick={() => window.location.reload()}
        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
      >
        Donate Again
      </button>
    </div>
  </div>
);

const FormField = ({ 
  label, type, value, onChange, placeholder, error, required, 
  helpText, icon: Icon, rows = 3, min 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      )}
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-300' : 'border-gray-300'}`}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-300' : 'border-gray-300'}`}
          placeholder={placeholder}
          min={min}
        />
      )}
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
    {helpText && (
      <p className="text-gray-500 text-xs mt-1">{helpText}</p>
    )}
  </div>
);

const CheckboxField = ({ label, checked, onChange, helpText }) => (
  <div>
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
    {helpText && (
      <p className="text-gray-500 text-xs mt-1 ml-7">{helpText}</p>
    )}
  </div>
);

export default DonationForm;