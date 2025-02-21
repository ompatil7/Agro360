/* eslint-disable no-unused-vars */
import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-6 relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="h-24 w-24 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
          </div>
          <h1 className="text-5xl font-bold text-emerald-900 relative z-10">
            Cultivating <span className="text-emerald-600">Agricultural</span>{" "}
            Innovation
          </h1>
          <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
            Bridging cutting-edge technology with farming excellence through AI
            and blockchain solutions
          </p>
        </div>

        {/* Team Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              name: "Pruthvij Desai",
              role: "Backend Developer & AI / ML Developer",
              img: "https://res.cloudinary.com/pruthvij/image/upload/v1739876752/lgffjuvpujygdqt5esdb.jpg",
            },
            {
              name: "Mehul Singh Charak",
              role: "AI Research Lead",
              img: "https://res.cloudinary.com/pruthvij/image/upload/v1712483108/shzclzdvbfwwdfkctlcy.jpg",
            },
            {
              name: "Om Patil",
              role: "React Developer & AgroTech Engineer",
              img: "https://res.cloudinary.com/pruthvij/image/upload/v1714233794/kjpe1oc3zg9avnpw72do.jpg",
            },
            {
              name: "Chaitali Kapse",
              role: "Marketplace Designer",
              img: "https://res.cloudinary.com/pruthvij/image/upload/v1714112771/jg3amjmjrjqayqvr5d55.jpg",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="group relative h-[500px] overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent z-10"></div>

              {/* Image container with fixed size and centered positioning */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{
                    width: "100%", // Ensures the image fills the container
                    height: "100%", // Ensures the image fills the container
                    objectFit: "cover", // Ensures the image covers the area without distortion
                    objectPosition: "center", // Centers the image within the container
                  }}
                />
              </div>

              {/* Member details */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-emerald-200 font-medium mb-3">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-emerald-900/5 backdrop-blur-sm rounded-3xl p-12 text-center border border-emerald-900/10 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">
              Our Agricultural Vision
            </h2>
            <p className="text-lg text-emerald-700 max-w-4xl mx-auto leading-relaxed">
              We are revolutionizing farming ecosystems by merging AI-driven
              crop insights with blockchain-secured transactions. Our platform
              empowers 2 million+ farmers with real-time disease detection, fair
              insurance solutions, and direct access to global markets through
              sustainable technology.
            </p>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { number: "40%", label: "Yield Loss Reduction" },
            { number: "1.2M", label: "Claims Processed" },
            { number: "98%", label: "Disease Accuracy" },
            { number: "4.8★", label: "Farmer Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-emerald-700 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
// const AboutUs = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Animated Header */}
//         <div className="text-center mb-20 space-y-6 relative overflow-hidden">
//           <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/gradient-white-lines-pattern_52683-66205.jpg')] opacity-10"></div>
//           <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 relative z-10 animate-fade-in-up">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-800">
//               Farmings Digital Revolution
//             </span>
//           </h1>
//           <p className="text-xl text-emerald-700 max-w-3xl mx-auto font-light">
//             Where Blockchain Security Meets AI Precision in Agriculture
//           </p>
//         </div>

//         {/* Core Innovations Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-28">
//           {/* Blockchain Insurance Card */}
//           <div className="relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-emerald-100/40 transition-all duration-500 group overflow-hidden">
//             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
//             <div className="relative z-10">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="p-4 bg-emerald-100 rounded-xl">
//                   <svg
//                     className="w-8 h-8 text-emerald-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold text-emerald-900">
//                   Blockchain-Powered Insurance
//                 </h3>
//               </div>
//               <p className="text-emerald-700 mb-6">
//                 Immutable smart contracts automate claims using geotagged
//                 imagery and weather data integration, reducing processing time
//                 by 70% while eliminating fraudulent claims.
//               </p>
//               <div className="flex gap-4">
//                 <div className="p-4 bg-emerald-50 rounded-xl flex-1">
//                   <p className="text-sm font-semibold text-emerald-600">
//                     Real-Time Verification
//                   </p>
//                   <p className="text-2xl font-bold text-emerald-900">98.3%</p>
//                   <p className="text-xs text-emerald-500">Claim Accuracy</p>
//                 </div>
//                 <div className="p-4 bg-emerald-50 rounded-xl flex-1">
//                   <p className="text-sm font-semibold text-emerald-600">
//                     Automated Processing
//                   </p>
//                   <p className="text-2xl font-bold text-emerald-900">2.4M</p>
//                   <p className="text-xs text-emerald-500">Claims Handled</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* AI Disease Detection Card */}
//           <div className="relative bg-emerald-900 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 group overflow-hidden">
//             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
//             <div className="relative z-10">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="p-4 bg-emerald-800/30 rounded-xl">
//                   <svg
//                     className="w-8 h-8 text-emerald-300"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold text-white">
//                   AI Disease Detection System
//                 </h3>
//               </div>
//               <p className="text-emerald-100 mb-6">
//                 Multi-modal analysis combining visual, audio, and environmental
//                 data with 94.7% accuracy across 57 crop varieties, delivering
//                 multilingual treatment recommendations in under 8 seconds.
//               </p>
//               <div className="relative h-64 bg-emerald-800 rounded-xl overflow-hidden">
//                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
//                   <div className="animate-pulse grid grid-cols-3 gap-4 w-full p-4">
//                     {[...Array(9)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="h-8 bg-emerald-700/40 rounded-lg"
//                       ></div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="relative z-10 p-6">
//                   <div className="flex gap-4">
//                     <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
//                       <p className="text-xs text-emerald-200">
//                         Current Detection
//                       </p>
//                       <p className="text-lg font-bold text-white">
//                         Tomato Blight
//                       </p>
//                       <p className="text-xs text-emerald-300">94% Confidence</p>
//                     </div>
//                     <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
//                       <p className="text-xs text-emerald-200">
//                         Recommended Treatment
//                       </p>
//                       <p className="text-lg font-bold text-white">
//                         Copper Fungicide
//                       </p>
//                       <p className="text-xs text-emerald-300">
//                         Apply every 7 days
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Marketplace & Chatbot Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-28">
//           {/* Agro Marketplace */}
//           <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="p-4 bg-amber-100 rounded-xl">
//                 <svg
//                   className="w-8 h-8 text-amber-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-emerald-900">
//                 AI-Powered Marketplace
//               </h3>
//             </div>
//             <p className="text-emerald-700 mb-6">
//               Direct farmer-to-buyer platform with dynamic pricing algorithms
//               and yield prediction models, increasing profit margins by an
//               average of 35%.
//             </p>
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               {["Wheat", "Rice", "Corn"].map((crop, i) => (
//                 <div
//                   key={i}
//                   className="p-4 bg-emerald-50 rounded-xl text-center"
//                 >
//                   <p className="text-sm text-emerald-600">Current Price</p>
//                   <p className="text-xl font-bold text-emerald-900">
//                     ${Math.floor(Math.random() * 200 + 100)}/ton
//                   </p>
//                   <p className="text-xs text-emerald-500">{crop}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* NLP Chatbot */}
//           <div className="relative bg-emerald-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="p-4 bg-emerald-700/30 rounded-xl">
//                 <svg
//                   className="w-8 h-8 text-emerald-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-white">
//                 Smart Farming Assistant
//               </h3>
//             </div>
//             <div className="space-y-4">
//               <div className="flex justify-end">
//                 <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl max-w-[80%]">
//                   <p className="text-sm text-emerald-100">
//                     How to prevent rice blast disease?
//                   </p>
//                 </div>
//               </div>
//               <div className="flex justify-start">
//                 <div className="bg-emerald-700 p-3 rounded-xl max-w-[80%]">
//                   <p className="text-sm text-white">
//                     Apply tricyclazole fungicide at 0.1% concentration. Maintain
//                     field drainage and ensure proper spacing...
//                   </p>
//                   <div className="mt-2 flex gap-2">
//                     <button className="text-xs px-2 py-1 bg-emerald-800 rounded-lg text-emerald-200 hover:bg-emerald-900 transition-colors">
//                       View Treatment Options
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Existing Team and Mission Sections */}

//         {/* Tech Ecosystem Diagram */}
//         <div className="mb-28 relative">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-emerald-900">
//               Integrated Agricultural Ecosystem
//             </h2>
//             <p className="text-emerald-600 mt-2">
//               Seamless technology integration empowering modern farming
//             </p>
//           </div>
//           <div className="relative h-96 bg-[url('https://previews.123rf.com/images/yupiramos/yupiramos1805/yupiramos180509067/101782399-abstract-modern-hexagon-line-connection-background-technology-network-communication.jpg')] bg-contain bg-no-repeat bg-center">
//             <div className="absolute left-[10%] top-[20%] bg-white p-4 rounded-xl shadow-lg">
//               <p className="font-bold text-emerald-600">Blockchain Layer</p>
//               <p className="text-sm text-emerald-500">Secure Transactions</p>
//             </div>
//             <div className="absolute right-[10%] top-[20%] bg-white p-4 rounded-xl shadow-lg">
//               <p className="font-bold text-emerald-600">AI Core</p>
//               <p className="text-sm text-emerald-500">Predictive Analytics</p>
//             </div>
//             <div className="absolute left-[25%] bottom-[30%] bg-white p-4 rounded-xl shadow-lg">
//               <p className="font-bold text-emerald-600">Data Layer</p>
//               <p className="text-sm text-emerald-500">Real-time Insights</p>
//             </div>
//             <div className="absolute right-[25%] bottom-[30%] bg-white p-4 rounded-xl shadow-lg">
//               <p className="font-bold text-emerald-600">Interface Layer</p>
//               <p className="text-sm text-emerald-500">Farmer-First Design</p>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Stats Section */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
//           {[
//             { number: "2.1M+", label: "Farmers Empowered", icon: "👨🌾" },
//             { number: "$4.8B", label: "Market Value", icon: "💸" },
//             { number: "57", label: "Crop Varieties", icon: "🌾" },
//             { number: "12", label: "Languages Supported", icon: "🗣️" },
//           ].map((stat, index) => (
//             <div
//               key={index}
//               className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
//             >
//               <div className="text-4xl mb-2">{stat.icon}</div>
//               <div className="text-3xl font-bold text-emerald-600 mb-2">
//                 {stat.number}
//               </div>
//               <div className="text-sm text-emerald-700 font-medium">
//                 {stat.label}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AboutUs;
