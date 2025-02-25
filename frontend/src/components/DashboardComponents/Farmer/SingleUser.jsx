import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sprout,
  Droplet,
  Thermometer,
  CloudRain,
  Waves,
  Loader2,
  ShieldCheck,
  Leaf,
  Map,
  Droplets,
  CalendarCheck,
  Coins,
} from "lucide-react";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`);
        setUserData(response.data.data.user);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 to-white">
        <Loader2 className="animate-spin w-12 h-12 text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8 bg-red-50 p-4 rounded-lg max-w-md mx-auto">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 p-8">
      {/* User Profile Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-green-100">
        <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-green-600/10 p-4 rounded-2xl">
              <User className="w-8 h-8 text-green-600" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-serif">
                {userData.name}
              </h1>
              <p className="text-gray-600 bg-green-100 px-3 py-1 rounded-full text-sm w-fit mt-1">
                {userData.role.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-green-50">
              <Mail className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">{userData.email}</span>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-green-50">
              <Phone className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">{userData.phone}</span>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-green-50">
              <MapPin className="w-6 h-6 text-green-600" />
              <span className="text-gray-700">
                {userData.address.street}, {userData.address.city},{" "}
                {userData.address.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Policies Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-600" />
          Policy Enrollments
        </h2>

        {userData.policyEnrollments.map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100 hover:shadow-xl transition-shadow"
          >
            {/* Policy Header */}
            <div className="border-b border-green-100 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    {policy.policyDetails.policyName}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {policy.policyDetails.policyNumber}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {policy.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </div>
            </div>

            {/* Policy Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Coverage Period
                    </p>
                    <p className="text-gray-700">
                      {new Date(
                        policy.policyDetails.seasonDates.startDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        policy.policyDetails.seasonDates.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    Sum Insured
                  </p>
                  <p className="text-xl font-bold text-amber-700">
                    ₹{policy.policyDetails.sumInsured.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    Premium
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    ₹{policy.policyDetails.premium}
                  </p>
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="bg-green-50 p-6 rounded-2xl mb-8 border border-green-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-green-600" />
                Farm Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">
                    Irrigation Type
                  </p>
                  <p className="text-gray-700 font-medium">
                    {policy.farmDetails.irrigationType}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium">Area Size</p>
                  <p className="text-gray-700 font-medium">
                    {policy.farmDetails.areaSize} acres
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                    <Map className="w-4 h-4" />
                    Location
                  </p>
                  <p className="text-gray-700 font-mono text-sm">
                    {policy.farmDetails.geolocation.coordinates[1].toFixed(4)},{" "}
                    {policy.farmDetails.geolocation.coordinates[0].toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Crop Details */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Droplet className="w-6 h-6 text-amber-600" />
                Insured Crops
              </h4>
              <div className="space-y-6">
                {policy.cropDetails.map((category, catIndex) => (
                  <div
                    key={catIndex}
                    className="bg-white p-4 rounded-xl border border-amber-100"
                  >
                    <h5 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
                      {category.cropCategory}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {category.crops.map((crop, cropIndex) => (
                        <div
                          key={cropIndex}
                          className="bg-white p-4 rounded-lg border border-green-50 hover:border-green-100 transition-colors"
                        >
                          <p className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <span className="bg-green-100 p-1.5 rounded-lg">
                              <Sprout className="w-4 h-4 text-green-600" />
                            </span>
                            {crop.cropType}
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Thermometer className="w-4 h-4 text-rose-500" />
                              <span className="text-gray-600">
                                {crop.thresholds.temperature.minTemperature}°C -{" "}
                                {crop.thresholds.temperature.maxTemperature}°C
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CloudRain className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-600">
                                {crop.thresholds.rainfall.minRainfall} -{" "}
                                {crop.thresholds.rainfall.maxRainfall}mm
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Waves className="w-4 h-4 text-emerald-500" />
                              <span className="text-gray-600">
                                {crop.thresholds.humidity.minHumidity} -{" "}
                                {crop.thresholds.humidity.maxHumidity}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
