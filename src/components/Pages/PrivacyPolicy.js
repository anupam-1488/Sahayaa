// src/components/Pages/PrivacyPolicy.js
import React from 'react';
import { Shield, Lock, Mail, Phone, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <img
                  src="/logo.jpg"
                  alt="Sahayaa Trust Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">SAHAYAA TRUST</h1>
                <p className="text-blue-100">"The one who stands with you"</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Shield className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 font-semibold">Effective Date: January 1, 2025</p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">1. Information We Collect</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email, phone number, address</li>
                  <li><strong>Financial Information:</strong> Donation amounts, payment method (processed securely via Razorpay)</li>
                  <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
                  <li><strong>Voluntary Information:</strong> Messages, feedback, volunteer applications</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">2. How We Use Your Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Processing donations and issuing receipts</li>
                  <li>Communicating about our programs and impact</li>
                  <li>Sending tax exemption certificates</li>
                  <li>Improving our website and services</li>
                  <li>Complying with legal requirements</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">3. Information Sharing</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell, trade, or share your personal information with third parties except:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With payment processors (Razorpay) for donation processing</li>
                  <li>When required by law or legal process</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">4. Data Security</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We use industry-standard security measures to protect your data</li>
                  <li>Payment information is encrypted and processed securely</li>
                  <li>We regularly update our security practices</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">5. Your Rights</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Request corrections to your data</li>
                  <li>Opt-out of communications</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">6. Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies to improve your browsing experience and analyze website traffic. You can disable cookies in your browser settings.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-blue-800 mb-4">7. Third-Party Links</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to third-party sites. We are not responsible for their privacy practices.
                </p>
              </section>
            </div>

            {/* Contact Information */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Community Service Center, Hyderabad, Telangana, India</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span>info@sahayaa.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;