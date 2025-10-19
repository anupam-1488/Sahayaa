
// import React, { useState, useEffect } from 'react';
// import { 
//   Users, Heart, GraduationCap, Activity, Home as HomeIcon, 
//   Utensils, TrendingUp, Target, MapPin, Calendar, IndianRupee,
//   Award, Clock, BarChart3
// } from 'lucide-react';
// const ImpactDashboard = () => {





// };

// const CurrentProjectsSection = ({ projects }) => (
//   <div className="bg-white p-8 rounded-2xl shadow-lg">
//     <div className="flex items-center mb-6">
//       <Target className="w-6 h-6 text-green-600 mr-3" />
//       <h3 className="text-2xl font-bold text-gray-800">Current Projects</h3>
//     </div>
// <div className="space-y-6">
//   {projects.map((project) => (
//     <ProjectCard key={project.id} project={project} />
//   ))}
// </div>
//   </div>
// );
// const ProjectCard = ({ project }) => {
// const IconComponent = project.icon;
// return (
// <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
// <div className="flex items-start justify-between mb-4">
// <div className="flex items-center space-x-3">
// <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: project.color + '20' }}>
// <IconComponent className="w-5 h-5" style={{ color: project.color }} />
// </div>
// <div>
// <h4 className="font-bold text-gray-800">{project.name}</h4>
// <p className="text-sm text-gray-600">{project.description}</p>
// </div>
// </div>
// <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
// {project.category}
// </span>
// </div>
//   <div className="mb-4">
//     <div className="flex justify-between items-center mb-2">
//       <span className="text-sm font-medium text-gray-700">Progress</span>
//       <span className="text-sm font-bold" style={{ color: project.color }}>
//         {project.current}/{project.target} ({project.progress}%)
//       </span>
//     </div>
//     <div className="w-full bg-gray-200 rounded-full h-3">
//       <div 
//         className="h-3 rounded-full transition-all duration-1000 ease-out"
//         style={{ 
//           width: `${project.progress}%`,
//           backgroundColor: project.color
//         }}
//       ></div>
//     </div>
//   </div>
  
//   <div className="flex items-center text-sm text-gray-500">
//     <MapPin className="w-4 h-4 mr-1" />
//     <span>{project.location}</span>
//   </div>
// </div>
// );
// };
// const FundAllocationChart = ({ data }) => {
// // Calculate the cumulative angles for the pie chart
// let cumulativePercentage = 0;
// const processedData = data.map(item => {
// const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
// cumulativePercentage += item.value;
// const endAngle = cumulativePercentage * 3.6;
// return {
// ...item,
// startAngle,
// endAngle
// };
// });
// return (
// <div className="bg-white p-8 rounded-2xl shadow-lg">
// <div className="flex items-center mb-6">
// <IndianRupee className="w-6 h-6 text-green-600 mr-3" />
// <h3 className="text-2xl font-bold text-gray-800">Fund Allocation</h3>
// </div>
//   {/* CSS Pie Chart */}
//   <div className="flex items-center justify-center mb-6">
//     <div className="relative w-48 h-48">
//       <div 
//         className="w-full h-full rounded-full"
//         style={{
//           background: `conic-gradient(
//             ${processedData.map(item => 
//               `${item.color} ${item.startAngle}deg ${item.endAngle}deg`
//             ).join(', ')}
//           )`
//         }}
//       >
//         <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-gray-800">₹50L</div>
//             <div className="text-sm text-gray-600">Total</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <div className="space-y-3">
//     {data.map((item, index) => (
//       <div key={index} className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div 
//             className="w-4 h-4 rounded-full"
//             style={{ backgroundColor: item.color }}
//           ></div>
//           <span className="text-sm font-medium text-gray-700">{item.name}</span>
//         </div>
//         <div className="text-right">
//           <div className="text-sm font-bold text-gray-800">{item.value}%</div>
//           <div className="text-xs text-gray-500">{item.amount}</div>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
// );
// };
// const GeographicImpactSection = ({ data }) => (
//   <div className="bg-white p-8 rounded-2xl shadow-lg">
//     <div className="flex items-center mb-6">
//       <MapPin className="w-6 h-6 text-green-600 mr-3" />
//       <h3 className="text-2xl font-bold text-gray-800">Geographic Impact</h3>
//     </div>
// <div className="space-y-4">
//   {data.map((location, index) => (
//     <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//       <div className="flex items-center space-x-3">
//         <div 
//           className="w-3 h-3 rounded-full"
//           style={{ backgroundColor: location.color }}
//         ></div>
//         <div>
//           <div className="font-semibold text-gray-800">{location.state}</div>
//           <div className="text-sm text-gray-600">{location.projects} active projects</div>
//         </div>
//       </div>
//       <div className="text-right">
//         <div className="font-bold text-gray-800">{location.beneficiaries.toLocaleString()}</div>
//         <div className="text-sm text-gray-500">beneficiaries</div>
//       </div>
//     </div>
//   ))}
// </div>
//   </div>
// );
// const MonthlyTrendChart = ({ data }) => (
//   <div className="bg-white p-8 rounded-2xl shadow-lg">
//     <div className="flex items-center mb-6">
//       <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
//       <h3 className="text-2xl font-bold text-gray-800">Monthly Impact Trend</h3>
//     </div>
// {/* CSS Bar Chart */}
// <div className="space-y-4">
//   {data.map((item, index) => (
//     <div key={index} className="space-y-2">
//       <div className="flex justify-between items-center">
//         <span className="text-sm font-medium text-gray-700">{item.month}</span>
//         <div className="text-right">
//           <div className="text-sm font-bold text-green-600">{item.lives} lives</div>
//           <div className="text-xs text-gray-500">₹{item.amount.toLocaleString()}</div>
//         </div>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-3">
//         <div 
//           className="h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
//           style={{ width: `${item.percentage}%` }}
//         ></div>
//       </div>
//     </div>
//   ))}
// </div>

// <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
//   <div className="flex items-center justify-between">
//     <div>
//       <div className="text-lg font-bold text-green-600">734 Lives</div>
//       <div className="text-sm text-gray-600">This Month</div>
//     </div>
//     <div className="text-right">
//       <div className="text-lg font-bold text-blue-600">₹2.67L</div>
//       <div className="text-sm text-gray-600">Funds Used</div>
//     </div>
//   </div>
// </div>
//   </div>
// );
// const RealtimeUpdates = () => {
// const [currentUpdate, setCurrentUpdate] = useState(0);
// const updates = [
// { icon: Heart, text: "5 minutes ago: Priya from Mumbai donated ₹2,000 for education", color: "text-red-500" },
// { icon: Users, text: "12 minutes ago: Health camp in Delhi helped 25 families", color: "text-blue-500" },
// { icon: GraduationCap, text: "1 hour ago: 15 children completed literacy program in Rajasthan", color: "text-green-500" },
// { icon: Utensils, text: "2 hours ago: Nutrition program served 200 meals today", color: "text-orange-500" }
// ];
// useEffect(() => {
// const timer = setInterval(() => {
// setCurrentUpdate((prev) => (prev + 1) % updates.length);
// }, 4000);
// return () => clearInterval(timer);
// }, [updates.length]);
// return (
// <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-2xl">
// <div className="flex items-center mb-6">
// <Clock className="w-6 h-6 mr-3" />
// <h3 className="text-2xl font-bold">Live Activity Feed</h3>
// </div>
//   <div className="h-16 flex items-center relative overflow-hidden">
//     {updates.map((update, index) => {
//       const IconComponent = update.icon;
//       return (
//         <div
//           key={index}
//           className={`flex items-center space-x-3 transition-all duration-500 absolute w-full ${
//             index === currentUpdate 
//               ? 'opacity-100 transform translate-x-0' 
//               : 'opacity-0 transform translate-x-4'
//           }`}
//         >
//           <IconComponent className="w-6 h-6 text-white" />
//           <span className="text-lg">{update.text}</span>
//         </div>
//       );
//     })}
//   </div>
  
//   <div className="flex space-x-2 mt-4">
//     {updates.map((_, index) => (
//       <div
//         key={index}
//         className={`w-2 h-2 rounded-full transition-all duration-300 ${
//           index === currentUpdate ? 'bg-white' : 'bg-white/30'
//         }`}
//       />
//     ))}
//   </div>
// </div>
// );
// };
// export default ImpactDashboard;
