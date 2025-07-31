// src/components/Pages/PaymentSuccess.js - Handle Instamojo Payment Return
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Download, Home, RefreshCw } from 'lucide-react';
import { donationAPI } from '../../services/api';

const PaymentSuccess = ({ setActiveSection }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [donationData, setDonationData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  const handlePaymentReturn = async () => {
    try {
      // Parse URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get('payment_id');
      const paymentStatus = urlParams.get('payment_status');
      const paymentRequestId = urlParams.get('payment_request_id');

      console.log('🔍 Processing payment return:', {
        paymentId,
        paymentStatus,
        paymentRequestId
      });

      if (!paymentId || !paymentRequestId) {
        throw new Error('Invalid payment parameters. Please contact support.');
      }

      // Get stored form data
      const storedFormData = localStorage.getItem('sahayaa_donation_form');
      const storedDonationId = localStorage.getItem('sahayaa_donation_id');
      
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }

      // Verify payment with backend
      const verificationResponse = await donationAPI.verifyPayment({
        payment_id: paymentId,
        payment_request_id: paymentRequestId,
        donorDetails: JSON.parse(storedFormData || '{}')
      });

      if (verificationResponse.success) {
        setSuccess(true);
        setDonationData({
          donationId: verificationResponse.donationId,
          amount: verificationResponse.amount
        });
        setPaymentDetails(verificationResponse.paymentDetails);
        
        // Clear stored data
        localStorage.removeItem('sahayaa_donation_form');
        localStorage.removeItem('sahayaa_donation_id');
        
        console.log('✅ Payment verified successfully');
      } else {
        throw new Error(verificationResponse.error || 'Payment verification failed');
      }

    } catch (error) {
      console.error('❌ Payment verification error:', error);
      setError(error.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!donationData?.donationId) return;
    
    try {
      setLoading(true);
      const response = await donationAPI.getReceipt(donationData.donationId);
      
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sahayaa-donation-receipt-${donationData.donationId}.pdf`;
      link.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Receipt download error:', error);
      alert('Receipt download is not yet available. You will receive it via email.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    setActiveSection('home');
  };

  const retryVerification = () => {
    setLoading(true);
    setError('');
    handlePaymentReturn();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={retryVerification}
        onGoHome={goToHome}
      />
    );
  }

  if (success && donationData) {
    return (
      <SuccessState 
        donationData={donationData}
        paymentDetails={paymentDetails}
        formData={formData}
        onDownloadReceipt={downloadReceipt}
        onGoHome={goToHome}
      />
    );
  }

  return null;
};

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full mx-4">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Payment</h2>
      <p className="text-gray-600 mb-6">
        Please wait while we confirm your payment with Instamojo...
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          🔒 This process is secure and should take just a few seconds.
        </p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry, onGoHome }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full mx-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-12 h-12 text-red-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-red-800 mb-4">Payment Verification Failed</h2>
      <p className="text-gray-600 mb-6">
        {error}
      </p>
      
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Retry Verification</span>
        </button>
        
        <button
          onClick={onGoHome}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Go to Homepage</span>
        </button>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-yellow-800 text-sm">
          <strong>Need help?</strong> Contact us at info@sahayaa.org with your payment details.
        </p>
      </div>
    </div>
  </div>
);

const SuccessState = ({ 
  donationData, 
  paymentDetails, 
  formData, 
  onDownloadReceipt, 
  onGoHome 
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-2xl w-full mx-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        Thank You for Your Donation!
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Your generous contribution will make a real difference in our community.
      </p>
      
      {/* Donation Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Donation Details</h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-green-700 font-medium">Donation ID</p>
            <p className="text-green-800 font-bold">{donationData.donationId}</p>
          </div>
          
          <div>
            <p className="text-green-700 font-medium">Amount</p>
            <p className="text-green-800 font-bold text-2xl">
              ₹{donationData.amount.toLocaleString('en-IN')}
            </p>
          </div>
          
          {formData?.cause && (
            <div>
              <p className="text-green-700 font-medium">Cause</p>
              <p className="text-green-800 capitalize">{formData.cause}</p>
            </div>
          )}
          
          {paymentDetails?.payment_id && (
            <div>
              <p className="text-green-700 font-medium">Payment ID</p>
              <p className="text-green-800 font-mono text-sm">
                {paymentDetails.payment_id}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-green-600 text-sm">
            Tax Benefit: ₹{Math.floor(donationData.amount * 0.5).toLocaleString('en-IN')} (approx. 50% under Section 80G)
          </p>
        </div>
      </div>

      {/* Payment Method Info */}
      {paymentDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Payment Method:</strong> {paymentDetails.instrument_type || 'Online'} via Instamojo
            {paymentDetails.fees && (
              <span className="ml-2">• Processing Fee: ₹{paymentDetails.fees}</span>
            )}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-4 mb-8">
        {formData?.wantReceipt && (
          <button
            onClick={onDownloadReceipt}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Tax Receipt</span>
          </button>
        )}
        
        <button
          onClick={onGoHome}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* What's Next */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
        <h4 className="font-semibold text-yellow-800 mb-3">What happens next?</h4>
        <ul className="text-yellow-700 text-sm space-y-2">
          <li>• Your donation will be allocated to the selected cause within 48 hours</li>
          <li>• You'll receive a confirmation email shortly</li>
          <li>• Tax receipt will be processed within 2-3 business days</li>
          <li>• You'll get quarterly impact reports showing how your donation helped</li>
          <li>• You can track our progress on our website and social media</li>
        </ul>
      </div>
      
      {/* Contact Info */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Questions? Contact us at <strong>info@sahayaa.org</strong> or <strong>+91 98765 43210</strong>
        </p>
      </div>
    </div>
  </div>
);

export default PaymentSuccess;