// src/components/Pages/Donations.js - Simplified Bank Transfer Only
import React, { useState } from 'react';
import { 
  Heart, IndianRupee, Users, GraduationCap, Activity, 
  Home, Utensils, Shield, Award, CreditCard, 
  Mail, Phone, Copy, Check
} from 'lucide-react';

const Donations = () => {
  return (
    <div className="space-y-16">
      <DonationHero />
      <DonationStats />
      <BankTransferSection />
      <BankTransferInstructions />
      <TaxBenefits />
      <TrustInfo />
      <DonationImpact />
    </div>
  );
};

const DonationHero = () => (
  <div className="relative text-center py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
    <div className="relative z-10">
      <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-bold text-green-800 mb-6">Support Our Mission</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
        Your donation helps us build a compassionate society where everyone lives with dignity, 
        health, knowledge, and joy. Every contribution creates ripples of positive change.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <DonationFeature icon={CreditCard} text="Bank Transfer" />
        <DonationFeature icon={Award} text="80G Tax Exemption" />
        <DonationFeature icon={Heart} text="Trusted by 5000+" />
        <DonationFeature icon={Shield} text="100% Secure" />
      </div>
    </div>
  </div>
);

const DonationFeature = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full">
    <Icon className="w-4 h-4 text-green-600" />
    <span className="text-green-800 font-medium text-sm">{text}</span>
  </div>
);

const DonationStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <StatCard icon={IndianRupee} value="₹50L+" label="Funds Raised" color="green" />
    <StatCard icon={Users} value="5000+" label="Lives Impacted" color="blue" />
    <StatCard icon={Heart} value="1200+" label="Donors" color="red" />
    <StatCard icon={Award} value="150+" label="Projects Funded" color="purple" />
  </div>
);

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500', 
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const BankTransferSection = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-8">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCard className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-3xl font-bold text-blue-800 mb-2">Bank Account Details</h3>
      <p className="text-blue-600 text-lg">
        Transfer your donation directly to our bank account
      </p>
    </div>

    <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
      <div className="space-y-4 mb-8">
        <BankDetail label="Bank Name" value="Axis Bank Ltd" />
        <BankDetail label="Branch" value="Tenali Branch" />
        <BankDetail label="Account Holder" value="SAHAYAA TRUST" />
        <BankDetail label="Account Number" value="925020046061191" copyable />
        <BankDetail label="IFSC Code" value="UTIB0000556" copyable />
        <BankDetail label="Customer ID" value="977**6689" />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          After Your Transfer
        </h4>
        <ul className="text-green-700 space-y-2">
          <li>• Send payment screenshot to info@sahayaa.org</li>
          <li>• Include your full name, phone number, and PAN card</li>
          <li>• Mention purpose of donation in email subject</li>
          <li>• Tax receipt will be emailed within 7 working days</li>
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <ContactButton 
          icon={Mail}
          text="Email Receipt Request"
          href="mailto:info@sahayaa.org?subject=Donation Receipt Request"
        />
        <ContactButton 
          icon={Phone}
          text="Call for Support"
          href="tel:+919876543210"
        />
      </div>
    </div>
  </div>
);

const BankDetail = ({ label, value, copyable = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="text-sm text-gray-600 font-medium">{label}</div>
        <div className="text-lg font-bold text-gray-800">{value}</div>
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          className="ml-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      )}
    </div>
  );
};

const ContactButton = ({ icon: Icon, text, href }) => (
  <a
    href={href}
    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
  >
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </a>
);

const BankTransferInstructions = () => (
  <div className="bg-white rounded-3xl p-8 shadow-xl">
    <div className="text-center mb-8">
      <h3 className="text-3xl font-bold text-gray-800 mb-2">How to Donate</h3>
      <p className="text-gray-600">Simple 3-step process</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      <InstructionStep 
        step="1"
        title="Bank Transfer"
        description="Use the account details above to transfer your donation amount via NEFT, RTGS, or UPI"
        icon={CreditCard}
        color="blue"
      />
      <InstructionStep 
        step="2"
        title="Screenshot"
        description="Take a screenshot of your payment confirmation showing transaction details"
        icon={Phone}
        color="green"
      />
      <InstructionStep 
        step="3"
        title="Email Us"
        description="Send the screenshot along with your details to info@sahayaa.org for tax receipt"
        icon={Mail}
        color="purple"
      />
    </div>
  </div>
);

const InstructionStep = ({ step, title, description, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600', 
    purple: 'bg-purple-600'
  };

  return (
    <div className="text-center">
      <div className={`w-16 h-16 ${colors[color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl font-bold text-white">{step}</span>
      </div>
      <Icon className="w-8 h-8 text-gray-600 mx-auto mb-3" />
      <h4 className="font-bold text-gray-800 mb-3 text-lg">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const TaxBenefits = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8">
    <div className="text-center mb-6">
      <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-yellow-800">Tax Benefits</h3>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-yellow-800 mb-3">80G Tax Exemption</h4>
        <ul className="space-y-2 text-yellow-700">
          <li>• 50% tax deduction under Section 80G</li>
          <li>• Valid for donations of ₹100 and above</li>
          <li>• Digital receipt provided via email</li>
          <li>• PAN-based automated tax certificate</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-yellow-800 mb-3">Documentation</h4>
        <ul className="space-y-2 text-yellow-700">
          <li>• 80G Registration: Available</li>
          <li>• FCRA Registration: In Process</li>
          <li>• 12A Registration: Active</li>
          <li>• Receipt within 7 working days</li>
        </ul>
      </div>
    </div>
  </div>
);

const TrustInfo = () => (
  <div className="bg-green-50 border border-green-200 rounded-3xl p-8">
    <div className="text-center mb-6">
      <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-green-800">Why Trust Sahayaa?</h3>
    </div>
    
    <div className="grid md:grid-cols-3 gap-6">
      <TrustFeature 
        icon={Award}
        title="Transparent Operations"
        description="Annual reports and financial statements published regularly"
      />
      <TrustFeature 
        icon={Users}
        title="Community Driven" 
        description="Programs designed with and for the communities we serve"
      />
      <TrustFeature 
        icon={Heart}
        title="Proven Impact"
        description="5+ years of consistent service with measurable results"
      />
    </div>
  </div>
);

const TrustFeature = ({ icon: Icon, title, description }) => (
  <div className="text-center">
    <Icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
    <h4 className="font-semibold text-green-800 mb-2">{title}</h4>
    <p className="text-green-700 text-sm">{description}</p>
  </div>
);

const DonationImpact = () => (
  <div className="bg-white p-8 rounded-3xl shadow-xl">
    <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
      Your Donation Creates Impact
    </h3>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ImpactCard 
        amount="₹100"
        impact="Nutritious meals for a child for one week"
        icon={Utensils}
        color="orange"
      />
      <ImpactCard 
        amount="₹500"
        impact="Child education materials for one month"
        icon={GraduationCap}
        color="blue"
      />
      <ImpactCard 
        amount="₹1000"
        impact="Basic medical care for 5 people"
        icon={Activity}
        color="red"
      />
      <ImpactCard 
        amount="₹2500"
        impact="Community infrastructure development"
        icon={Home}
        color="purple"
      />
    </div>
  </div>
);

const ImpactCard = ({ amount, impact, icon: Icon, color }) => {
  const colors = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500', 
    purple: 'bg-purple-500'
  };

  return (
    <div className="text-center p-6 border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-green-800 mb-2">{amount}</div>
      <p className="text-gray-600 text-sm">{impact}</p>
    </div>
  );
};

export default Donations;
