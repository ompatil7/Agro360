import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userPhoto from "../../assets/avatars/user3.jpg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/v1/users");
        setUsers(response.data.users.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load users data");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewMore = (id) => {
    navigate(`/profile/user/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center text-xl mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        User Directory
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6"
          >
            <div className="flex items-center mb-4">
              <img
                className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                src={user.photo || userPhoto}
                alt={`${user.name}'s profile`}
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-700">
                  {user.address.city}, {user.address.state}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-700">{user.phone}</span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700 truncate">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => handleViewMore(user._id)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Sprout,
//   Droplet,
//   Thermometer,
//   CloudRain,
//   Waves,
//   Loader2,
// } from "lucide-react";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           "/api/v1/users/67b97d6294d85dadcdf61b7a"
//         );
//         setUserData(response.data.data.user);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load user data");
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="animate-spin w-8 h-8 text-green-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* User Profile Section */}
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
//         <div className="p-8">
//           <div className="flex items-center gap-6 mb-6">
//             <div className="bg-green-100 p-4 rounded-full">
//               <User className="w-8 h-8 text-green-600" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 {userData.name}
//               </h1>
//               <p className="text-gray-600">{userData.role}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex items-center gap-4">
//               <Mail className="w-5 h-5 text-gray-500" />
//               <span>{userData.email}</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <Phone className="w-5 h-5 text-gray-500" />
//               <span>{userData.phone}</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <MapPin className="w-5 h-5 text-gray-500" />
//               <span>
//                 {userData.address.street}, {userData.address.city},{" "}
//                 {userData.address.state}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Policies Section */}
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-xl font-semibold mb-4">Policy Enrollments</h2>

//         {userData.policyEnrollments.map((policy) => (
//           <div
//             key={policy.id}
//             className="bg-white rounded-xl shadow-md p-6 mb-6"
//           >
//             {/* Policy Header */}
//             <div className="border-b pb-4 mb-4">
//               <h3 className="text-lg font-semibold text-green-700">
//                 {policy.policyDetails.policyName}
//               </h3>
//               <p className="text-gray-600">
//                 {policy.policyDetails.policyNumber}
//               </p>
//             </div>

//             {/* Policy Details */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="flex items-center gap-3">
//                 <Calendar className="w-5 h-5 text-green-600" />
//                 <div>
//                   <p className="text-sm text-gray-500">Coverage Period</p>
//                   <p>
//                     {new Date(
//                       policy.policyDetails.seasonDates.startDate
//                     ).toLocaleDateString()}{" "}
//                     -{" "}
//                     {new Date(
//                       policy.policyDetails.seasonDates.endDate
//                     ).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Sum Insured</p>
//                 <p className="font-semibold">
//                   ₹{policy.policyDetails.sumInsured.toLocaleString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Premium</p>
//                 <p className="font-semibold">₹{policy.policyDetails.premium}</p>
//               </div>
//             </div>

//             {/* Farm Details */}
//             <div className="border-t pt-4 mb-6">
//               <h4 className="font-semibold mb-4 flex items-center gap-2">
//                 <Sprout className="w-5 h-5 text-green-600" />
//                 Farm Details
//               </h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Irrigation Type</p>
//                   <p>{policy.farmDetails.irrigationType}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Area Size</p>
//                   <p>{policy.farmDetails.areaSize} acres</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Location</p>
//                   <p>
//                     {policy.farmDetails.geolocation.coordinates[1]},{" "}
//                     {policy.farmDetails.geolocation.coordinates[0]}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Crop Details */}
//             <div className="border-t pt-4">
//               <h4 className="font-semibold mb-4 flex items-center gap-2">
//                 <Droplet className="w-5 h-5 text-green-600" />
//                 Insured Crops
//               </h4>
//               <div className="space-y-6">
//                 {policy.cropDetails.map((category, catIndex) => (
//                   <div key={catIndex} className="bg-gray-50 p-4 rounded-lg">
//                     <h5 className="font-medium mb-3">
//                       {category.cropCategory}
//                     </h5>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {category.crops.map((crop, cropIndex) => (
//                         <div
//                           key={cropIndex}
//                           className="bg-white p-4 rounded-md shadow-sm"
//                         >
//                           <p className="font-medium mb-2">{crop.cropType}</p>
//                           <div className="space-y-2">
//                             <div className="flex items-center gap-2">
//                               <Thermometer className="w-4 h-4 text-gray-500" />
//                               <span className="text-sm">
//                                 Temp:{" "}
//                                 {crop.thresholds.temperature.minTemperature}°C -{" "}
//                                 {crop.thresholds.temperature.maxTemperature}°C
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <CloudRain className="w-4 h-4 text-gray-500" />
//                               <span className="text-sm">
//                                 Rainfall: {crop.thresholds.rainfall.minRainfall}
//                                 mm - {crop.thresholds.rainfall.maxRainfall}mm
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Waves className="w-4 h-4 text-gray-500" />
//                               <span className="text-sm">
//                                 Humidity: {crop.thresholds.humidity.minHumidity}
//                                 % - {crop.thresholds.humidity.maxHumidity}%
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
