// src/components/Pages/Donations.js
import React, { useState } from 'react';
import { 
  Heart, IndianRupee, Users, GraduationCap, Activity, 
  Home, Utensils, Shield, Award, CreditCard, Lock,
  CheckCircle, Download, Mail, Phone
} from 'lucide-react';
import DonationForm from '../Forms/DonationForm';

const Donations = () => {
  const [selectedCause, setSelectedCause] = useState('general');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const donationCauses = [
    {
      id: 'general',
      title: 'General Fund',
      description: 'Support our overall mission and help us where the need is greatest',
      icon: Heart,
      color: 'green',
      impact: 'Supports all our programs and initiatives'
    },
    {
      id: 'education',
      title: 'Education for All',
      description: 'Help children access quality education and learning resources',
      icon: GraduationCap,
      color: 'blue',
      impact: '₹500 can sponsor a child\'s education for one month'
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Wellness',
      description: 'Provide medical care and health awareness programs',
      icon: Activity,
      color: 'red',
      impact: '₹1000 can fund basic medical care for 5 people'
    },
    {
      id: 'community',
      title: 'Community Development',
      description: 'Build infrastructure and improve living conditions',
      icon: Home,
      color: 'purple',
      impact: '₹2000 can help improve community facilities'
    },
    {
      id: 'nutrition',
      title: 'Nutrition Programs',
      description: 'Fight hunger and malnutrition in our communities',
      icon: Utensils,
      color: 'orange',
      impact: '₹100 can provide nutritious meals for one week'
    },
    {
      id: 'emergency',
      title: 'Emergency Relief',
      description: 'Rapid response to disasters and emergency situations',
      icon: Shield,
      color: 'yellow',
      impact: '₹1500 can provide emergency kit for a family'
    }
  ];

  const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];

  const handleDonate = () => {
    const amount = customAmount || selectedAmount;
    if (!amount || amount < 10) {
      alert('Please enter a minimum donation amount of ₹10');
      return;
    }
    setShowDonationForm(true);
  };

  const selectedCauseData = donationCauses.find(cause => cause.id === selectedCause);

  return (
    <div className="space-y-16">
      <DonationHero />
      
      <DonationStats />
      
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Donation Causes */}
        <div className="lg:col-span-2">
          <CausesSection 
            causes={donationCauses}
            selectedCause={selectedCause}
            setSelectedCause={setSelectedCause}
          />
        </div>
        
        {/* Donation Form */}
        <div className="lg:col-span-1">
          <DonationCard 
            selectedCause={selectedCauseData}
            quickAmounts={quickAmounts}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
            onDonate={handleDonate}
          />
        </div>
      </div>

      <TaxBenefits />
      <TrustInfo />
      <DonationImpact />

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm
          show={showDonationForm}
          onClose={() => setShowDonationForm(false)}
          amount={customAmount || selectedAmount}
          cause={selectedCauseData}
        />
      )}
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
      <h1 className="text-5xl font-bold text-green-800 mb-6">Make a Difference</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
        Your donation helps us build a compassionate society where everyone lives with dignity, 
        health, knowledge, and joy. Every contribution, no matter the size, creates ripples of positive change.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <DonationFeature icon={Lock} text="100% Secure" />
        <DonationFeature icon={Award} text="80G Tax Exemption" />
        <DonationFeature icon={Heart} text="Trusted by 5000+" />
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
    <StatCard 
      icon={IndianRupee}
      value="₹50L+"
      label="Funds Raised"
      color="green"
    />
    <StatCard 
      icon={Users}
      value="5000+"
      label="Lives Impacted"
      color="blue"
    />
    <StatCard 
      icon={Heart}
      value="1200+"
      label="Donors"
      color="red"
    />
    <StatCard 
      icon={Award}
      value="150+"
      label="Projects Funded"
      color="purple"
    />
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

const CausesSection = ({ causes, selectedCause, setSelectedCause }) => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-green-800">Choose Your Cause</h2>
    <p className="text-gray-600">
      Select the area where you'd like your donation to make the most impact. 
      Each cause represents a critical need in our community.
    </p>
    
    <div className="grid gap-4">
      {causes.map((cause) => (
        <CauseCard
          key={cause.id}
          cause={cause}
          isSelected={selectedCause === cause.id}
          onSelect={() => setSelectedCause(cause.id)}
        />
      ))}
    </div>
  </div>
);

const CauseCard = ({ cause, isSelected, onSelect }) => {
  const colorClasses = {
    green: 'border-green-200 bg-green-50 text-green-600',
    blue: 'border-blue-200 bg-blue-50 text-blue-600',
    red: 'border-red-200 bg-red-50 text-red-600',
    purple: 'border-purple-200 bg-purple-50 text-purple-600',
    orange: 'border-orange-200 bg-orange-50 text-orange-600',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600'
  };

  return (
    <div
      onClick={onSelect}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? `${colorClasses[cause.color]} shadow-lg scale-105` 
          : 'border-gray-200 bg-white hover:shadow-md hover:border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-white/50' : 'bg-gray-100'
        }`}>
          <cause.icon className={`w-6 h-6 ${
            isSelected ? colorClasses[cause.color].split(' ')[2] : 'text-gray-600'
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${
            isSelected ? colorClasses[cause.color].split(' ')[2] : 'text-gray-800'
          }`}>
            {cause.title}
          </h3>
          <p className={`mb-3 ${
            isSelected ? 'text-gray-700' : 'text-gray-600'
          }`}>
            {cause.description}
          </p>
          <div className={`text-sm font-medium ${
            isSelected ? colorClasses[cause.color].split(' ')[2] : 'text-gray-500'
          }`}>
            💡 {cause.impact}
          </div>
        </div>
        
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isSelected 
            ? `${colorClasses[cause.color].split(' ')[2]} border-current`
            : 'border-gray-300'
        }`}>
          {isSelected && <CheckCircle className="w-4 h-4 fill-current" />}
        </div>
      </div>
    </div>
  );
};

const DonationCard = ({ 
  selectedCause, quickAmounts, selectedAmount, setSelectedAmount, 
  customAmount, setCustomAmount, onDonate 
}) => (
  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-6">
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-green-800 mb-2">Donate Now</h3>
      <p className="text-gray-600">Every contribution makes a difference</p>
    </div>

    {/* Selected Cause Display */}
    {selectedCause && (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-3">
          <selectedCause.icon className="w-5 h-5 text-green-600" />
          <div>
            <h4 className="font-semibold text-gray-800">{selectedCause.title}</h4>
            <p className="text-sm text-gray-600">{selectedCause.impact}</p>
          </div>
        </div>
      </div>
    )}

    {/* Quick Amount Buttons */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Amount
      </label>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => {
              setSelectedAmount(amount);
              setCustomAmount('');
            }}
            className={`p-3 rounded-lg border-2 transition-colors ${
              selectedAmount === amount && !customAmount
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            ₹{amount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="relative">
        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="number"
          placeholder="Enter custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount('');
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="10"
        />
      </div>
    </div>

    {/* Donate Button */}
    <button
      onClick={onDonate}
      disabled={!selectedAmount && !customAmount}
      className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
    >
      <CreditCard className="w-5 h-5" />
      <span>Donate Securely</span>
    </button>

    {/* Security Info */}
    <div className="mt-4 text-center">
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Secured by Razorpay</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Your payment information is encrypted and secure
      </p>
    </div>
  </div>
);

const TaxBenefits = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8">
    <div className="text-center mb-6">
      <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-blue-800">Tax Benefits</h3>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold text-blue-800 mb-3">80G Tax Exemption</h4>
        <ul className="space-y-2 text-blue-700">
          <li>• 50% tax deduction under Section 80G</li>
          <li>• Valid for donations of ₹100 and above</li>
          <li>• Digital receipt provided instantly</li>
          <li>• PAN-based automated tax certificate</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-blue-800 mb-3">Documentation</h4>
        <ul className="space-y-2 text-blue-700">
          <li>• 80G Registration Number: Available</li>
          <li>• FCRA Registration: In Process</li>
          <li>• 12A Registration: Active</li>
          <li>• Digital receipts via email</li>
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
        icon={CheckCircle}
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
      Your Donation Impact
    </h3>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ImpactCard 
        amount="₹100"
        impact="Provides nutritious meals for a child for one week"
        icon={Utensils}
      />
      <ImpactCard 
        amount="₹500"
        impact="Sponsors a child's education materials for one month"
        icon={GraduationCap}
      />
      <ImpactCard 
        amount="₹1000"
        impact="Funds basic medical care for 5 community members"
        icon={Activity}
      />
      <ImpactCard 
        amount="₹2500"
        impact="Supports community infrastructure development"
        icon={Home}
      />
    </div>
  </div>
);

const ImpactCard = ({ amount, impact, icon: Icon }) => (
  <div className="text-center p-6 border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-green-600" />
    </div>
    <div className="text-2xl font-bold text-green-800 mb-2">{amount}</div>
    <p className="text-gray-600 text-sm">{impact}</p>
  </div>
);

export default Donations;