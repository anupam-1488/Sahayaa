// src/components/Pages/RefundPolicy.js
import React from 'react';
import { RefreshCw, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8">
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
                <p className="text-orange-100">"The one who stands with you"</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Cancellations and Refunds Policy</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
              <p className="text-orange-800 font-semibold">Effective Date: January 1, 2025</p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-orange-800 mb-4">1. General Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  As a charitable organization, all donations made to Sahayaa Trust are generally <strong>non-refundable</strong>. This policy ensures that funds are directed toward our charitable programs and beneficiaries as intended.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-orange-800 mb-4">2. Exceptional Circumstances for Refunds</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Refunds may be considered in the following situations:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Technical Errors:</strong> Duplicate payments due to payment gateway issues</li>
                  <li><strong>Unauthorized Transactions:</strong> Payments made without the donor's knowledge or consent</li>
                  <li><strong>System Errors:</strong> Incorrect donation amounts charged due to technical failures</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-orange-800 mb-4">3. Refund Process</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Refund requests must be made within <strong>7 days</strong> of the donation</li>
                  <li>Submit requests via email to <strong>donations@sahayaa.org</strong></li>
                  <li>Include transaction ID, donation date, and reason for refund</li>
                  <li>Refunds will be processed within 7-10 business days after approval</li>
                  <li>Refunds will be credited to the original payment method</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-orange-800 mb-4">4. Tax Receipt Implications</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>If a refund is processed, any issued tax exemption receipt becomes invalid</li>
                  <li>Donors must not claim tax benefits for refunded donations</li>
                  <li>We will provide updated documentation if required</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-orange-800 mb-4">5. Cancellation of Recurring Donations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Recurring donors may cancel future donations at any time</li>
                  <li>Contact us at donations@sahayaa.org to stop recurring donations</li>
                  <li>Cancellation will be effective from the next billing cycle</li>
                </ul>
              </section>
            </div>

            {/* Contact for Refunds */}
            <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-800 mb-4">Contact for Refund Requests</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-orange-600" />
                  <span>donations@sahayaa.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-orange-600" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Subject Line: "Refund Request - [Transaction ID]"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;