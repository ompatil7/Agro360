// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaTractor,
//   FaSeedling,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaMoneyBillWave,
//   FaUser,
//   FaCloudRain,
//   FaThermometerHalf,
// } from "react-icons/fa";

// const PolicyTracker = () => {
//   const [policies, setPolicies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPolicies = async () => {
//       try {
//         const response = await axios.get("/api/v1/track");
//         setPolicies(response.data.data.all);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load policy data");
//         setLoading(false);
//       }
//     };

//     fetchPolicies();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString("en-IN", options);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 bg-gradient-to-b from-green-50 to-emerald-100 min-h-screen">
//         <div className="text-red-600 text-xl font-semibold">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-8">
//       <header className="max-w-7xl mx-auto mb-12 text-center">
//         <h1 className="text-4xl font-bold text-emerald-800 mb-4 font-serif">
//           🌾 CropGuard Insurance Dashboard
//         </h1>
//         <p className="text-emerald-600 text-lg">
//           Managing Agricultural Protection Policies
//         </p>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {policies.map((policy) => (
//           <div
//             key={policy._id}
//             className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-emerald-50"
//           >
//             {/* Policy Header */}
//             <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/10 rounded-full">
//                   <FaTractor className="text-2xl text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-white">
//                     {policy.policyDetails.policyName}
//                   </h2>
//                   <p className="text-emerald-100 text-sm mt-1">
//                     Policy No: {policy.policyDetails.policyNumber}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Policy Content */}
//             <div className="p-6 space-y-6">
//               {/* Farmer Card */}
//               <div className="bg-green-50 rounded-xl p-4 border border-green-100">
//                 <div className="flex items-center gap-3 mb-3">
//                   <FaUser className="text-emerald-700" />
//                   <h3 className="font-semibold text-emerald-800">
//                     Farmer Information
//                   </h3>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-emerald-700">👤</span>
//                     <span className="font-medium">
//                       {policy.farmerDetails.name}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-emerald-700">📧</span>
//                     <a
//                       href={`mailto:${policy.farmerDetails.email}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       {policy.farmerDetails.email}
//                     </a>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <FaMapMarkerAlt className="text-emerald-700" />
//                     <span>
//                       {policy.farmerDetails.address.district},{" "}
//                       {policy.farmerDetails.address.state}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Farm Details */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FaMapMarkerAlt className="text-amber-600" />
//                     <h4 className="font-semibold text-amber-800">Farm Size</h4>
//                   </div>
//                   <p className="text-3xl font-bold text-amber-700">
//                     {policy.farmDetails.areaSize}ha
//                   </p>
//                 </div>

//                 <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FaThermometerHalf className="text-teal-600" />
//                     <h4 className="font-semibold text-teal-800">Irrigation</h4>
//                   </div>
//                   <p className="text-xl font-bold text-teal-700">
//                     {policy.farmDetails.irrigationType}
//                   </p>
//                 </div>
//               </div>

//               {/* Crop Details */}
//               <div className="bg-green-50 rounded-xl p-4 border border-green-100">
//                 <div className="flex items-center gap-3 mb-4">
//                   <FaSeedling className="text-emerald-700" />
//                   <h3 className="font-semibold text-emerald-800">
//                     Crop Protection
//                   </h3>
//                 </div>

//                 {policy.cropDetails.map((category, idx) => (
//                   <div key={idx} className="mb-4 last:mb-0">
//                     <h4 className="font-medium text-emerald-800 mb-3">
//                       {category.cropCategory}
//                     </h4>
//                     <div className="space-y-3">
//                       {category.crops.map((crop, cropIdx) => (
//                         <div
//                           key={cropIdx}
//                           className="bg-white p-3 rounded-lg shadow-sm border border-green-50"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="font-medium text-gray-800">
//                               {crop.cropType}
//                             </span>
//                           </div>

//                           {/* Temperature Range */}
//                           <div className="flex items-center gap-2 text-sm mb-2">
//                             <FaThermometerHalf className="text-red-400" />
//                             <div className="flex-1 bg-gray-200 rounded-full h-2">
//                               <div
//                                 className="bg-gradient-to-r from-red-400 to-orange-400 h-2 rounded-full"
//                                 style={{
//                                   width: `${
//                                     (crop.thresholds.temperature
//                                       .minTemperature +
//                                       crop.thresholds.temperature
//                                         .maxTemperature) /
//                                     2
//                                   }%`,
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-gray-600 text-xs">
//                               {crop.thresholds.temperature.minTemperature}°-
//                               {crop.thresholds.temperature.maxTemperature}°C
//                             </span>
//                           </div>

//                           {/* Rainfall Range */}
//                           <div className="flex items-center gap-2 text-sm mb-2">
//                             <FaCloudRain className="text-blue-400" />
//                             <div className="flex-1 bg-gray-200 rounded-full h-2">
//                               <div
//                                 className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
//                                 style={{
//                                   width: `${
//                                     (crop.thresholds.rainfall.minRainfall +
//                                       crop.thresholds.rainfall.maxRainfall) /
//                                     25
//                                   }%`,
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-gray-600 text-xs">
//                               {crop.thresholds.rainfall.minRainfall}-
//                               {crop.thresholds.rainfall.maxRainfall}mm
//                             </span>
//                           </div>

//                           {/* Humidity Range */}
//                           <div className="flex items-center gap-2 text-sm">
//                             <FaThermometerHalf className="text-green-400" />
//                             <div className="flex-1 bg-gray-200 rounded-full h-2">
//                               <div
//                                 className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
//                                 style={{
//                                   width: `${
//                                     (crop.thresholds.humidity.minHumidity +
//                                       crop.thresholds.humidity.maxHumidity) /
//                                     2
//                                   }%`,
//                                 }}
//                               ></div>
//                             </div>
//                             <span className="text-gray-600 text-xs">
//                               {crop.thresholds.humidity.minHumidity}-
//                               {crop.thresholds.humidity.maxHumidity}%
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Policy Footer */}
//               <div className="border-t pt-4">
//                 <div className="flex flex-wrap justify-between items-center gap-4">
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2 text-emerald-700">
//                       <FaCalendarAlt />
//                       <span className="text-sm">
//                         {formatDate(policy.policyDetails.seasonDates.startDate)}{" "}
//                         - {formatDate(policy.policyDetails.seasonDates.endDate)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FaMoneyBillWave className="text-emerald-700" />
//                       <span className="text-sm font-medium">
//                         Sum Insured: ₹{policy.policyDetails.sumInsured}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         policy.payment === "done"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-orange-100 text-orange-800"
//                       }`}
//                     >
//                       {policy.payment === "done" ? "Paid" : "Pending"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PolicyTracker;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTractor,
  FaSeedling,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUser,
  FaCloudRain,
  FaThermometerHalf,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const PolicyTracker = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get("/api/v1/track");
        setPolicies(response.data.data.all);
        setLoading(false);
      } catch (err) {
        setError("Failed to load policy data");
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-gradient-to-b from-green-50 to-emerald-100 min-h-screen">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-8">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4 font-serif">
          🌱 Agricultural Policy Tracker
        </h1>
        <p className="text-emerald-600 text-lg">
          Managed Crop Insurance Policies
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {policies.map((policy) => (
          <Link to={`/insurance/${policy.insurancePolicy}`} key={policy._id}>
            <div
              key={policy._id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-emerald-50"
            >
              {/* Policy Header */}
              <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    <FaTractor className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {policy.policyDetails.policyName}
                    </h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      Policy No: {policy.policyDetails.policyNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Content */}
              <div className="p-6 space-y-6">
                {/* Farmer Information */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <FaUser className="text-emerald-700" />
                    <h3 className="font-semibold text-emerald-800">
                      Farmer Details
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-700">👤</span>
                      {policy.farmerDetails.name}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-700">📞</span>
                      {policy.farmerDetails.phone}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <FaMapMarkerAlt className="text-emerald-700" />
                      {policy.farmerDetails.address.district},{" "}
                      {policy.farmerDetails.address.state}
                    </p>
                  </div>
                </div>

                {/* Farm Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Area
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">
                      {policy.farmDetails.areaSize}ha
                    </p>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaThermometerHalf className="text-teal-600" />
                      <span className="text-sm font-medium text-teal-800">
                        Irrigation
                      </span>
                    </div>
                    <p className="text-xl font-bold text-teal-700">
                      {policy.farmDetails.irrigationType}
                    </p>
                  </div>
                </div>

                {/* Crop Details */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <FaSeedling className="text-emerald-700" />
                    <h3 className="font-semibold text-emerald-800">
                      Crop Details
                    </h3>
                  </div>

                  {policy.cropDetails.map((category, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      <h4 className="font-medium text-emerald-800 mb-3 pb-2 border-b border-emerald-100">
                        {category.cropCategory}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {category.crops.map((crop, cropIdx) => (
                          <div
                            key={cropIdx}
                            className="bg-white p-3 rounded-lg shadow-sm border border-green-50"
                          >
                            <div className="mb-2">
                              <span className="font-medium text-gray-800 text-sm">
                                {crop.cropType}
                              </span>
                            </div>

                            {/* Climate Parameters */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FaThermometerHalf className="text-red-400 text-xs" />
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-red-400 to-orange-400 h-1.5 rounded-full"
                                    style={{
                                      width: `${
                                        (crop.thresholds.temperature
                                          .minTemperature +
                                          crop.thresholds.temperature
                                            .maxTemperature) /
                                        2
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <FaCloudRain className="text-blue-400 text-xs" />
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1.5 rounded-full"
                                    style={{
                                      width: `${
                                        (crop.thresholds.rainfall.minRainfall +
                                          crop.thresholds.rainfall
                                            .maxRainfall) /
                                        25
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <FaThermometerHalf className="text-green-400 text-xs" />
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-1.5 rounded-full"
                                    style={{
                                      width: `${
                                        (crop.thresholds.humidity.minHumidity +
                                          crop.thresholds.humidity
                                            .maxHumidity) /
                                        2
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {/* Value Labels */}
                            <div className="grid grid-cols-3 gap-1 mt-2">
                              <span className="text-[10px] text-gray-600 text-center">
                                {crop.thresholds.temperature.minTemperature}°-
                                {crop.thresholds.temperature.maxTemperature}°C
                              </span>
                              <span className="text-[10px] text-gray-600 text-center">
                                {crop.thresholds.rainfall.minRainfall}-
                                {crop.thresholds.rainfall.maxRainfall}mm
                              </span>
                              <span className="text-[10px] text-gray-600 text-center">
                                {crop.thresholds.humidity.minHumidity}-
                                {crop.thresholds.humidity.maxHumidity}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Policy Footer */}
                <div className="border-t pt-4">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <FaCalendarAlt />
                        <span>
                          {formatDate(
                            policy.policyDetails.seasonDates.startDate
                          )}{" "}
                          -{" "}
                          {formatDate(policy.policyDetails.seasonDates.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <FaMoneyBillWave />
                        <span>Insured: ₹{policy.policyDetails.sumInsured}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          policy.payment === "done"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {policy.payment === "done" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PolicyTracker;
