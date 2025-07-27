// src/components/Pages/TermsAndConditions.js
import React from 'react';
import { Shield, FileText, Mail, Phone, MapPin } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
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
                <p className="text-green-100">"The one who stands with you"</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <FileText className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Terms and Conditions</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 font-semibold">Effective Date: January 1, 2025</p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">1. About Sahayaa Trust</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sahayaa Trust is a non-profit organization dedicated to building a compassionate society where everyone lives with dignity, health, knowledge, and joy. We focus on education, healthcare, community development, and emergency relief.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">2. Acceptance of Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  By accessing our website and making donations, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">3. Donations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All donations are voluntary and made in good faith</li>
                  <li>Donations are used for charitable purposes as outlined in our mission</li>
                  <li>Minimum donation amount is ₹10</li>
                  <li>We provide 80G tax exemption receipts for eligible donations</li>
                  <li>Donations are non-refundable except in cases of technical errors</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">4. Use of Website</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>You may use our website for lawful purposes only</li>
                  <li>You agree not to use the website in any way that could damage our reputation</li>
                  <li>We reserve the right to restrict access to any part of our website</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">5. Intellectual Property</h3>
                <p className="text-gray-700 leading-relaxed">
                  All content on this website, including text, images, and logos, is the property of Sahayaa Trust unless otherwise stated.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">6. Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sahayaa Trust shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-green-800 mb-4">7. Changes to Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                </p>
              </section>
            </div>

            {/* Contact Information */}
            <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  <span>Community Service Center, Hyderabad, Telangana, India</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-green-600" />
                  <span>info@sahayaa.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
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

export default TermsAndConditions;