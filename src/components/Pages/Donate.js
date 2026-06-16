// src/components/Pages/Donate.js
import React from 'react';
import { 
  Heart, CreditCard, Gift, ShieldCheck, 
  CheckCircle2, Info,  Share2 
} from 'lucide-react';

const Donate = () => {
  // Donation Details
  const DONATION_DETAILS = {
    bank: {
      accountName: "Sahayaa Trust",
      accountNumber: "925020046061191", // Replace with actual
      bankName: "Axis Bank",
      ifscCode: "UTIB0000556",
      branch: "Tenali"
    },
    upi: "sahayaatrust@upi", // Replace with actual
    impactTiers: [
      { amount: "₹500", description: "Provides educational kits for two children." },
      { amount: "₹1,500", description: "Covers monthly nutrition for a family in need." },
      { amount: "₹5,000", description: "Supports a community health camp initiative." }
    ]
  };

  return (
    <div className="space-y-12">
      <DonateHeader />
      
      <div className="grid lg:grid-cols-2 gap-12">
        <ImpactSection tiers={DONATION_DETAILS.impactTiers} />
        <PaymentSection details={DONATION_DETAILS} />
      </div>

      <TrustBanner />
    </div>
  );
};

const DonateHeader = () => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
      <Heart className="w-8 h-8 text-red-500 fill-current" />
    </div>
    <h1 className="text-5xl font-bold text-green-800 mb-6">Support Our Cause</h1>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Your contribution empowers us to bring sustainable change to Guntur and beyond. 
      Every rupee donated goes directly towards our community projects.
    </p>
  </div>
);

const ImpactSection = ({ tiers }) => (
  <div className="space-y-8">
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-50">
      <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
        <Gift className="text-green-600" /> Your Impact
      </h2>
      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <div key={index} className="flex items-center p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors">
            <div className="text-2xl font-bold text-green-700 w-24">{tier.amount}</div>
            <div className="h-8 w-px bg-green-200 mx-4"></div>
            <p className="text-gray-700">{tier.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-8 rounded-3xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShieldCheck /> 80G Tax Benefit
      </h3>
      <p className="text-green-100 mb-4">
        Donations to Sahayaa Trust are eligible for tax exemption under Section 80G of the Income Tax Act. 
        Please contact us after your donation to receive your receipt.
      </p>
      <button className="flex items-center gap-2 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all">
        <Info className="w-4 h-4" /> Learn More
      </button>
    </div>
  </div>
);

const PaymentSection = ({ details }) => (
  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
    <h2 className="text-2xl font-bold text-green-800 mb-6">Donation Options</h2>
    
    <div className="space-y-6">
      {/* UPI Section */}
      <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            {/* Replace with an actual QR code image */}
            <CreditCard className="w-16 h-16 text-green-600" />
            <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Scan to Pay</p>
          </div>
        </div>
        <p className="font-mono text-lg font-bold text-gray-800">{details.upi}</p>
        <p className="text-sm text-gray-500 mt-1">Accepts all UPI Apps (GPay, PhonePe, Paytm)</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or Bank Transfer</span></div>
      </div>

      {/* Bank Details Section */}
      <div className="space-y-4">
        <BankDetailRow label="Account Name" value={details.bank.accountName} />
        <BankDetailRow label="Account Number" value={details.bank.accountNumber} copyable />
        <BankDetailRow label="Bank Name" value={details.bank.bankName} />
        <BankDetailRow label="IFSC Code" value={details.bank.ifscCode} copyable />
        <BankDetailRow label="Branch" value={details.bank.branch} />
      </div>

      <button 
        onClick={() => window.location.href = 'mailto:sahayaatrust@gmail.com?subject=Donation Receipt Request'}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
      >
        <Share2 className="w-5 h-5" />
        I've Donated, Send Receipt
      </button>
    </div>
  </div>
);

const BankDetailRow = ({ label, value, copyable }) => (
  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
    {copyable && (
      <button 
        onClick={() => {
          navigator.clipboard.writeText(value);
          alert(`${label} copied!`);
        }}
        className="text-xs text-green-600 font-bold hover:underline"
      >
        COPY
      </button>
    )}
  </div>
);

const TrustBanner = () => (
  <div className="grid md:grid-cols-3 gap-6 py-8">
    {[
      { icon: CheckCircle2, text: "100% Transparency" },
      { icon: ShieldCheck, text: "Secure Transactions" },
      { icon: Heart, text: "Direct Impact" }
    ].map((item, i) => (
      <div key={i} className="flex items-center justify-center gap-3 text-gray-600">
        <item.icon className="text-green-600 w-5 h-5" />
        <span className="font-medium">{item.text}</span>
      </div>
    ))}
  </div>
);

export default Donate;