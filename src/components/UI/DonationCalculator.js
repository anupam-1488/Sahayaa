
// import React, { useState, useEffect } from 'react';
// import { 
//   Calculator, IndianRupee, Users, GraduationCap, Activity, 
//   Utensils, Home as HomeIcon, Heart, TrendingUp, Target,
//   ArrowRight, Zap, Award, Clock, CreditCard
// } from 'lucide-react';
// const DonationCalculator = ({ onDonate }) => {
// const [donationAmount, setDonationAmount] = useState(1000);
// const [selectedCause, setSelectedCause] = useState('education');
// const [comparisonMode, setComparisonMode] = useState('average');
// const [animatedValues, setAnimatedValues] = useState({});
// // Cause impact data
// const causeImpacts = {
// education: {
// name: 'Education',
// icon: GraduationCap,
// color: '#3B82F6',
// unit: 'children',
// rate: 500, // ₹500 per child per month
// description: 'months of education',
// examples: [
// { amount: 500, impact: '1 child educated for 1 month' },
// { amount: 1000, impact: '2 children educated for 1 month' },
// { amount: 2500, impact: '5 children educated for 1 month' },
// { amount: 5000, impact: '10 children educated for 1 month' }
// ]
// },
// healthcare: {
// name: 'Healthcare',
// icon: Activity,
// color: '#EF4444',
// unit: 'people',
// rate: 200, // ₹200 per person
// description: 'people receive medical care',
// examples: [
// { amount: 200, impact: '1 person receives basic medical care' },
// { amount: 1000, impact: '5 people receive medical checkup' },
// { amount: 2000, impact: '10 people get emergency treatment' },
// { amount: 5000, impact: '25 people receive comprehensive care' }
// ]
// },
// nutrition: {
// name: 'Nutrition',
// icon: Utensils,
// color: '#F59E0B',
// unit: 'meals',
// rate: 25, // ₹25 per meal
// description: 'nutritious meals provided',
// examples: [
// { amount: 100, impact: '4 meals for hungry children' },
// { amount: 500, impact: '20 meals for a week' },
// { amount: 1000, impact: '40 meals for families' },
// { amount: 2500, impact: '100 meals for community' }
// ]
// },
// housing: {
// name: 'Housing',
// icon: HomeIcon,
// color: '#10B981',
// unit: 'families',
// rate: 10000, // ₹10,000 per family assistance
// description: 'families get housing support',
// examples: [
// { amount: 2500, impact: 'Home repair materials for 1 family' },
// { amount: 5000, impact: 'Temporary shelter for 2 families' },
// { amount: 10000, impact: 'Basic housing support for 1 family' },
// { amount: 25000, impact: 'Complete home assistance for 2 families' }
// ]
// },
// emergency: {
// name: 'Emergency Relief',
// icon: Zap,
// color: '#8B5CF6',
// unit: 'people',
// rate: 500, // ₹500 per person for emergency kit
// description: 'people get emergency aid',
// examples: [
// { amount: 500, impact: '1 emergency relief kit' },
// { amount: 1500, impact: '3 families get disaster relief' },
// { amount: 5000, impact: '10 people receive emergency aid' },
// { amount: 10000, impact: '20 people get comprehensive relief' }
// ]
// }
// };
// // Goal progress data
// const goals = [
// {
// name: 'Annual Education Goal',
// target: 500000,
// current: 342500,
// color: '#3B82F6',
// icon: GraduationCap,
// description: '1000 children educated for full year'
// },
// {
// name: 'Healthcare Outreach',
// target: 200000,
// current: 156000,
// color: '#EF4444',
// icon: Activity,
// description: '1000 people receive medical care'
// },
// {
// name: 'Nutrition Program',
// target: 300000,
// current: 187500,
// color: '#F59E0B',
// icon: Utensils,
// description: '12,000 meals for communities'
// }
// ];
// // Comparison data
// const comparisonData = {
// average: { value: 750, label: 'Average Donation' },
// popular: { value: 1500, label: 'Most Popular Amount' },
// impact: { value: 2500, label: 'High Impact Amount' }
// };
// // Calculate impact
// const calculateImpact = (amount, cause) => {
// const causeData = causeImpacts[cause];
// if (!causeData) return { count: 0, description: '' };
// const count = Math.floor(amount / causeData.rate);
// return {
//   count: count,
//   description: `${count} ${causeData.description}`,
//   unit: causeData.unit
// };
// };
// // Animate values when amount changes
// useEffect(() => {
// const impact = calculateImpact(donationAmount, selectedCause);
// const taxBenefit = Math.floor(donationAmount * 0.5);
// // Animate the values
// let startTime = Date.now();
// const duration = 500;
// const startValues = { ...animatedValues };
// const targetValues = {
//   impact: impact.count,
//   tax: taxBenefit,
//   amount: donationAmount
// };

// const animate = () => {
//   const elapsed = Date.now() - startTime;
//   const progress = Math.min(elapsed / duration, 1);
//   const eased = 1 - Math.pow(1 - progress, 3); // Ease out

//   setAnimatedValues({
//     impact: Math.floor((startValues.impact || 0) + (targetValues.impact - (startValues.impact || 0)) * eased),
//     tax: Math.floor((startValues.tax || 0) + (targetValues.tax - (startValues.tax || 0)) * eased),
//     amount: Math.floor((startValues.amount || 0) + (targetValues.amount - (startValues.amount || 0)) * eased)
//   });

//   if (progress < 1) {
//     requestAnimationFrame(animate);
//   }
// };

// requestAnimationFrame(animate);
// }, [donationAmount, selectedCause]);
// const handleAmountChange = (e) => {
// const value = parseInt(e.target.value) || 0;
// setDonationAmount(Math.max(10, Math.min(100000, value)));
// };
// const handleSliderChange = (e) => {
// setDonationAmount(parseInt(e.target.value));
// };
// const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];
// const currentCause = causeImpacts[selectedCause];
// const currentImpact = calculateImpact(donationAmount, selectedCause);
// const taxBenefit = Math.floor(donationAmount * 0.5);
// const comparisonAmount = comparisonData[comparisonMode].value;
// const comparisonImpact = calculateImpact(comparisonAmount, selectedCause);
// return (
// <div className="space-y-8">
// {/* Header */}
// <div className="text-center">
// <div className="flex items-center justify-center mb-4">
// <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
// <Calculator className="w-6 h-6 text-white" />
// </div>
// <h2 className="text-4xl font-bold text-green-800">Interactive Donation Calculator</h2>
// </div>
// <p className="text-xl text-gray-600 max-w-3xl mx-auto">
// See exactly how your donation creates impact. Adjust the amount and cause to visualize the difference you'll make.
// </p>
// </div>
//   {/* Main Calculator */}
//   <div className="grid lg:grid-cols-3 gap-8">
    
//     {/* Left: Input Controls */}
//     <div className="lg:col-span-1">
//       <InputControls
//         donationAmount={donationAmount}
//         selectedCause={selectedCause}
//         setSelectedCause={setSelectedCause}
//         handleAmountChange={handleAmountChange}
//         handleSliderChange={handleSliderChange}
//         quickAmounts={quickAmounts}
//         setDonationAmount={setDonationAmount}
//         causeImpacts={causeImpacts}
//       />
//     </div>

//     {/* Right: Impact Visualization */}
//     <div className="lg:col-span-2">
//       <ImpactVisualization
//         currentCause={currentCause}
//         donationAmount={donationAmount}
//         currentImpact={currentImpact}
//         taxBenefit={taxBenefit}
//         animatedValues={animatedValues}
//         onDonate={onDonate}
//       />
//     </div>
//   </div>

//   {/* Comparison Section */}
//   <ComparisonSection
//     donationAmount={donationAmount}
//     comparisonMode={comparisonMode}
//     setComparisonMode={setComparisonMode}
//     comparisonData={comparisonData}
//     comparisonAmount={comparisonAmount}
//     comparisonImpact={comparisonImpact}
//     currentImpact={currentImpact}
//     selectedCause={selectedCause}
//   />

//   {/* Goal Progress */}
//   <GoalProgress goals={goals} donationAmount={donationAmount} />

//   {/* Impact Examples */}
//   <ImpactExamples causeImpacts={causeImpacts} selectedCause={selectedCause} />
// </div>
// );
// };
// const InputControls = ({
// donationAmount, selectedCause, setSelectedCause, handleAmountChange,
// handleSliderChange, quickAmounts, setDonationAmount, causeImpacts
// }) => (
//   <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
//     <h3 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Donation</h3>
// {/* Amount Input */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount</label>
//   <div className="relative">
//     <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//     <input
//       type="number"
//       value={donationAmount}
//       onChange={handleAmountChange}
//       className="w-full pl-10 pr-4 py-3 text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//       min="10"
//       max="100000"
//     />
//   </div>
// </div>

// {/* Amount Slider */}
// <div>
//   <input
//     type="range"
//     min="10"
//     max="10000"
//     value={donationAmount}
//     onChange={handleSliderChange}
//     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
//     style={{
//       background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(donationAmount / 10000) * 100}%, #E5E7EB ${(donationAmount / 10000) * 100}%, #E5E7EB 100%)`
//     }}
//   />
//   <div className="flex justify-between text-xs text-gray-500 mt-1">
//     <span>₹10</span>
//     <span>₹10,000</span>
//   </div>
// </div>

// {/* Quick Amount Buttons */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-3">Quick Select</label>
//   <div className="grid grid-cols-2 gap-2">
//     {quickAmounts.map((amount) => (
//       <button
//         key={amount}
//         onClick={() => setDonationAmount(amount)}
//         className={`p-3 rounded-lg border-2 transition-all duration-200 ${
//           donationAmount === amount
//             ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
//             : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//         }`}
//       >
//         ₹{amount.toLocaleString()}
//       </button>
//     ))}
//   </div>
// </div>

// {/* Cause Selection */}
// <div>
//   <label className="block text-sm font-medium text-gray-700 mb-3">Select Cause</label>
//   <div className="space-y-2">
//     {Object.entries(causeImpacts).map(([key, cause]) => {
//       const IconComponent = cause.icon;
//       return (
//         <button
//           key={key}
//           onClick={() => setSelectedCause(key)}
//           className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
//             selectedCause === key
//               ? 'border-blue-500 bg-blue-50'
//               : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//           }`}
//         >
//           <div className="flex items-center space-x-3">
//             <div 
//               className="w-10 h-10 rounded-lg flex items-center justify-center"
//               style={{ backgroundColor: cause.color + '20' }}
//             >
//               <IconComponent className="w-5 h-5" style={{ color: cause.color }} />
//             </div>
//             <div>
//               <div className="font-semibold text-gray-800">{cause.name}</div>
//               <div className="text-sm text-gray-600">₹{cause.rate} per {cause.unit}</div>
//             </div>
//           </div>
//         </button>
//       );
//     })}
//   </div>
// </div>
//   </div>
// );
// const ImpactVisualization = ({
// currentCause, donationAmount, currentImpact, taxBenefit, animatedValues, onDonate
// }) => {
// const IconComponent = currentCause.icon;
// return (
// <div className="space-y-6">
// {/* Main Impact Display */}
// <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8 rounded-2xl">
// <div className="flex items-center mb-6">
// <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
// <IconComponent className="w-8 h-8 text-white" />
// </div>
// <div>
// <h3 className="text-2xl font-bold">Your Impact</h3>
// <p className="text-blue-100">with ₹{(animatedValues.amount || 0).toLocaleString()} donation</p>
// </div>
// </div>
//     <div className="grid md:grid-cols-2 gap-6">
//       <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
//         <div className="text-4xl font-bold mb-2">
//           {(animatedValues.impact || 0).toLocaleString()}
//         </div>
//         <div className="text-blue-100">
//           {currentImpact.description}
//         </div>
//       </div>
      
//       <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
//         <div className="text-4xl font-bold mb-2">
//           ₹{(animatedValues.tax || 0).toLocaleString()}
//         </div>
//         <div className="text-blue-100">
//           Tax benefit (80G exemption)
//         </div>
//       </div>
//     </div>

//     <button
//       onClick={() => onDonate && onDonate(donationAmount, currentCause.name.toLowerCase())}
//       className="w-full mt-6 bg-white text-blue-600 py-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 font-semibold text-lg"
//     >
//       <CreditCard className="w-5 h-5" />
//       <span>Donate ₹{donationAmount.toLocaleString()} Now</span>
//       <ArrowRight className="w-5 h-5" />
//     </button>
//   </div>

//   {/* Visual Impact Indicators */}
//   <div className="grid md:grid-cols-2 gap-4">
//     <div className="bg-white p-6 rounded-xl shadow-lg">
//       <div className="flex items-center mb-4">
//         <Target className="w-6 h-6 text-green-600 mr-3" />
//         <h4 className="font-semibold text-gray-800">Immediate Impact</h4>
//       </div>
//       <div className="text-2xl font-bold text-green-600 mb-2">
//         {currentImpact.count} {currentCause.unit}
//       </div>
//       <p className="text-gray-600 text-sm">
//         Your donation will directly help {currentImpact.count} {currentCause.unit} immediately.
//       </p>
//     </div>

//     <div className="bg-white p-6 rounded-xl shadow-lg">
//       <div className="flex items-center mb-4">
//         <Clock className="w-6 h-6 text-orange-600 mr-3" />
//         <h4 className="font-semibold text-gray-800">Long-term Effect</h4>
//       </div>
//       <div className="text-2xl font-bold text-orange-600 mb-2">
//         {Math.floor(currentImpact.count * 12)} annually
//       </div>
//       <p className="text-gray-600 text-sm">
//         Estimated annual impact if sustained monthly.
//       </p>
//     </div>
//   </div>
// </div>
// );
// };
// const ComparisonSection = ({
// donationAmount, comparisonMode, setComparisonMode, comparisonData,
// comparisonAmount, comparisonImpact, currentImpact, selectedCause
// }) => (
//   <div className="bg-white p-8 rounded-2xl shadow-lg">
//     <div className="flex items-center mb-6">
//       <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
//       <h3 className="text-2xl font-bold text-gray-800">Compare Your Donation</h3>
//     </div>
// {/* Comparison Mode Selector */}
// <div className="flex space-x-4 mb-6">
//   {Object.entries(comparisonData).map(([key, data]) => (
//     <button
//       key={key}
//       onClick={() => setComparisonMode(key)}
//       className={`px-4 py-2 rounded-lg transition-colors ${
//         comparisonMode === key
//           ? 'bg-purple-100 text-purple-700 font-semibold'
//           : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
//       }`}
//     >
//       {data.label}
//     </button>
//   ))}
// </div>

// {/* Comparison Display */}
// <div className="grid md:grid-cols-2 gap-6">
//   <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
//     <h4 className="font-semibold text-purple-800 mb-4">Your Donation</h4>
//     <div className="text-3xl font-bold text-purple-600 mb-2">
//       ₹{donationAmount.toLocaleString()}
//     </div>
//     <div className="text-purple-700">
//       Impact: {currentImpact.count} {causeImpacts[selectedCause].unit}
//     </div>
//   </div>

//   <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
//     <h4 className="font-semibold text-gray-800 mb-4">{comparisonData[comparisonMode].label}</h4>
//     <div className="text-3xl font-bold text-gray-600 mb-2">
//       ₹{comparisonAmount.toLocaleString()}
//     </div>
//     <div className="text-gray-700">
//       Impact: {comparisonImpact.count} {causeImpacts[selectedCause].unit}
//     </div>
//   </div>
// </div>

// {/* Comparison Result */}
// <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
//   <div className="text-center">
//     {donationAmount > comparisonAmount ? (
//       <div className="text-green-700">
//         <TrendingUp className="w-6 h-6 mx-auto mb-2" />
//         <p className="font-semibold">
//           Your donation is {Math.round((donationAmount / comparisonAmount) * 100 - 100)}% higher than {comparisonData[comparisonMode].label.toLowerCase()}!
//         </p>
//         <p className="text-sm mt-1">
//           You'll create {currentImpact.count - comparisonImpact.count} more units of impact.
//         </p>
//       </div>
//     ) : donationAmount < comparisonAmount ? (
//       <div className="text-blue-700">
//         <Target className="w-6 h-6 mx-auto mb-2" />
//         <p className="font-semibold">
//           Consider increasing by ₹{(comparisonAmount - donationAmount).toLocaleString()} to match {comparisonData[comparisonMode].label.toLowerCase()}.
//         </p>
//         <p className="text-sm mt-1">
//           That would create {comparisonImpact.count - currentImpact.count} additional units of impact.
//         </p>
//       </div>
//     ) : (
//       <div className="text-purple-700">
//         <Award className="w-6 h-6 mx-auto mb-2" />
//         <p className="font-semibold">
//           Your donation matches the {comparisonData[comparisonMode].label.toLowerCase()}!
//         </p>
//       </div>
//     )}
//   </div>
// </div>
//   </div>
// );
// const GoalProgress = ({ goals, donationAmount }) => (
//   <div className="bg-white p-8 rounded-2xl shadow-lg">
//     <div className="flex items-center mb-6">
//       <Target className="w-6 h-6 text-green-600 mr-3" />
//       <h3 className="text-2xl font-bold text-gray-800">Help Us Reach Our Goals</h3>
//     </div>
// <div className="grid md:grid-cols-3 gap-6">
//   {goals.map((goal, index) => {
//     const progress = (goal.current / goal.target) * 100;
//     const afterDonation = ((goal.current + donationAmount) / goal.target) * 100;
//     const IconComponent = goal.icon;

//     return (
//       <div key={index} className="bg-gray-50 p-6 rounded-xl">
//         <div className="flex items-center mb-4">
//           <div 
//             className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
//             style={{ backgroundColor: goal.color + '20' }}
//           >
//             <IconComponent className="w-5 h-5" style={{ color: goal.color }} />
//           </div>
//           <div className="flex-1">
//             <h4 className="font-semibold text-gray-800">{goal.name}</h4>
//             <p className="text-sm text-gray-600">{goal.description}</p>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="flex justify-between text-sm mb-2">
//             <span style={{ color: goal.color }}>
//               ₹{goal.current.toLocaleString()}
//             </span>
//             <span className="text-gray-500">
//               ₹{goal.target.toLocaleString()}
//             </span>
//           </div>
          
//           <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
//             <div 
//               className="h-3 rounded-full transition-all duration-1000"
//               style={{ 
//                 width: `${Math.min(progress, 100)}%`,
//                 backgroundColor: goal.color
//               }}
//             ></div>
//           </div>
          
//           {afterDonation > progress && (
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="h-2 rounded-full transition-all duration-1000 opacity-60"
//                 style={{ 
//                   width: `${Math.min(afterDonation, 100)}%`,
//                   backgroundColor: goal.color
//                 }}
//               ></div>
//             </div>
//           )}
//         </div>

//         <div className="text-center">
//           <div className="text-lg font-bold" style={{ color: goal.color }}>
//             {Math.round(progress)}%
//           </div>
//           {afterDonation > progress && (
//             <div className="text-sm text-gray-600">
//               +{Math.round(afterDonation - progress)}% with your donation
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   })}
// </div>
//   </div>
// );
// const ImpactExamples = ({ causeImpacts, selectedCause }) => {
// const currentCause = causeImpacts[selectedCause];
// return (
// <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200">
// <div className="flex items-center mb-6">
// <currentCause.icon className="w-6 h-6 text-emerald-600 mr-3" />
// <h3 className="text-2xl font-bold text-gray-800">{currentCause.name} Impact Examples</h3>
// </div>
//   <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//     {currentCause.examples.map((example, index) => (
//       <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//         <div className="text-2xl font-bold text-emerald-600 mb-2">
//           ₹{example.amount.toLocaleString()}
//         </div>
//         <p className="text-gray-700 text-sm">
//           {example.impact}
//         </p>
//       </div>
//     ))}
//   </div>
// </div>
// );
// };
// const causeImpacts = {
// education: {
// name: 'Education',
// icon: GraduationCap,
// color: '#3B82F6',
// unit: 'children',
// rate: 500,
// description: 'months of education',
// examples: [
// { amount: 500, impact: '1 child educated for 1 month' },
// { amount: 1000, impact: '2 children educated for 1 month' },
// { amount: 2500, impact: '5 children educated for 1 month' },
// { amount: 5000, impact: '10 children educated for 1 month' }
// ]
// },
// healthcare: {
// name: 'Healthcare',
// icon: Activity,
// color: '#EF4444',
// unit: 'people',
// rate: 200,
// description: 'people receive medical care',
// examples: [
// { amount: 200, impact: '1 person receives basic medical care' },
// { amount: 1000, impact: '5 people receive medical checkup' },
// { amount: 2000, impact: '10 people get emergency treatment' },
// { amount: 5000, impact: '25 people receive comprehensive care' }
// ]
// },
// nutrition: {
// name: 'Nutrition',
// icon: Utensils,
// color: '#F59E0B',
// unit: 'meals',
// rate: 25,
// description: 'nutritious meals provided',
// examples: [
// { amount: 100, impact: '4 meals for hungry children' },
// { amount: 500, impact: '20 meals for a week' },
// { amount: 1000, impact: '40 meals for families' },
// { amount: 2500, impact: '100 meals for community' }
// ]
// },
// housing: {
// name: 'Housing',
// icon: HomeIcon,
// color: '#10B981',
// unit: 'families',
// rate: 10000,
// description: 'families get housing support',
// examples: [
// { amount: 2500, impact: 'Home repair materials for 1 family' },
// { amount: 5000, impact: 'Temporary shelter for 2 families' },
// { amount: 10000, impact: 'Basic housing support for 1 family' },
// { amount: 25000, impact: 'Complete home assistance for 2 families' }
// ]
// },
// emergency: {
// name: 'Emergency Relief',
// icon: Zap,
// color: '#8B5CF6',
// unit: 'people',
// rate: 500,
// description: 'people get emergency aid',
// examples: [
// { amount: 500, impact: '1 emergency relief kit' },
// { amount: 1500, impact: '3 families get disaster relief' },
// { amount: 5000, impact: '10 people receive emergency aid' },
// { amount: 10000, impact: '20 people get comprehensive relief' }
// ]
// }
// };
// export default DonationCalculator;
