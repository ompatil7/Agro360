// components/DashboardComponents/Farmer/FarmerInsurances.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import axios from "axios";

import {
  Calendar,
  User,
  FileText,
  MapPin,
  Loader2,
  ChevronRight,
  AlertCircle,
  Crop,
  Shield,
  IndianRupee,
  Clock,
  ArrowRight,
  CheckCircle,
  IndianRupeeIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const InsuranceCard = ({ insurance }) => {
  const navigate = useNavigate();
  const startDate = new Date(
    insurance.policyDetails.seasonDates.startDate
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endDate = new Date(
    insurance.policyDetails.seasonDates.endDate
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 hover:border-mycol-mint shadow-sm hover:shadow-xl transition-all duration-300 max-w-2xl"
    >
      <div className="p-8">
        {/* Header with Status */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-mycol-mint to-mycol-mint-2 bg-clip-text text-transparent mb-3">
              {insurance.policyDetails.policyName}
            </h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <FileText className="w-5 h-5 text-mycol-mint" />
              <span className="text-md font-medium">
                Policy #{insurance.policyDetails.policyNumber}
              </span>
            </div>
          </div>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold ${
              insurance.status === "active"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            {insurance.status.toUpperCase()}
          </motion.span>
        </div>

        {/* Enhanced Main Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-6 p-6 bg-gradient-to-br from-mycol-nyanza/20 to-transparent rounded-xl">
            {/* Policy Details with enhanced styling */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Shield className="w-6 h-6 text-mycol-mint" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Sum Insured
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹
                    {insurance.policyDetails.sumInsured.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <IndianRupee className="w-6 h-6 text-mycol-mint" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Premium</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{insurance.policyDetails.premium.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Season Dates with enhanced styling */}
          <div className="p-6 bg-gradient-to-br from-mycol-nyanza/20 to-transparent rounded-xl">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-6 h-6 text-mycol-mint" />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  Season Period
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium text-gray-900">{startDate}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium text-gray-900">{endDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crop and Location Info */}
        <div className="grid grid-cols-2 gap-8 mb-8  pb-8 border-b border-gray-100">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Crop className="w-6 h-6 text-mycol-mint" />
              <div>
                <p className="text-gray-600 font-bold">Insured Crop</p>
                <p className="text-md font-medium text-gray-900">
                  {insurance.cropDetails[0].cropCategory} -{" "}
                  {insurance.cropDetails[0].crops[0].cropType}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-mycol-mint" />
              <div>
                <p className="text-gray-600 font-bold">Location</p>
                <p className="text-md font-medium text-gray-900">
                  {insurance.farmerDetails.address.district},{" "}
                  {insurance.farmerDetails.address.state}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-mycol-mint" />
              <div>
                <p className="text-gray-600 font-bold">Assigned Agent</p>
                <p className="text-md font-medium text-gray-900">
                  {insurance.agent.name}
                </p>
                <p className="text-gray-600">{insurance.agent.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/profile/my-insurances/${insurance.id}`)}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="font-medium">View Details</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const QuickStats = ({ insurances }) => {
  // ... [previous calculations remain the same]
  const activeInsurances = insurances.filter(
    (i) => i.status === "active"
  ).length;
  const totalInsured = insurances.reduce(
    (sum, i) => sum + i.policyDetails.sumInsured,
    0
  );

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {[
        {
          title: "Active Policies",
          value: activeInsurances,
          icon: ShieldAlertIcon,
          gradient: "from-green-500/10 to-green-600/5",
        },
        {
          title: "Total Sum Insured",
          value: `₹${totalInsured.toLocaleString("en-IN")}`,
          icon: IndianRupeeIcon,
          gradient: "from-blue-500/10 to-blue-600/5",
        },
        {
          title: "Coverage Status",
          value: "Active",
          icon: CheckCircle,
          gradient: "from-purple-500/10 to-purple-600/5",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-8 border border-gray-100 shadow-sm`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <stat.icon className="w-6 h-6 text-mycol-mint" />
            </div>
            <h4 className="text-lg font-medium text-gray-700">{stat.title}</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

const FarmerInsurances = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to fetch insurances
  const fetchInsurances = async () => {
    try {
      const response = await axios.get("/api/v1/track/myinsurances", {
        withCredentials: true,
      });
      setInsurances(response.data.data.enrollments);
    } catch (error) {
      console.error("Error fetching insurances:", error);
      setError("Failed to fetch your insurances");
      toast.error("Failed to fetch your insurances");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle payment success
  const handlePaymentSuccess = async (enrollmentId) => {
    try {
      const response = await axios.get(
        `/api/v1/payment/booking?enrollment=${enrollmentId}&payment=success`
      );
      if (response.status === 201) {
        toast.success("Insurance premium payment recorded successfully!");
        // Refresh the page and navigate back to the original URL
        window.location.href = "http://localhost:5173/profile/my-insurances";
        toast.success("Insurance premium payment recorded successfully!");
      } else {
        toast.error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }
  };

  // Monitor URL changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const enrollmentId = queryParams.get("enrollment");
    const paymentStatus = queryParams.get("payment");

    if (enrollmentId && paymentStatus === "success") {
      handlePaymentSuccess(enrollmentId);
    }
  }, [location.search]);

  // Fetch insurances on component mount
  useEffect(() => {
    fetchInsurances();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-mycol-mint mx-auto mb-4" />
          <p className="text-md text-gray-600">Loading your insurances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-mycol-mint to-mycol-mint-2 bg-clip-text text-transparent">
                My Insurance Policies
              </h1>
              <p className="text-xl text-gray-600">
                View and manage your active crop insurance policies
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 bg-mycol-nyanza/20 px-6 py-3 rounded-xl border border-mycol-mint/20"
            >
              <Clock className="w-6 h-6 text-mycol-mint" />
              <span className="text-gray-700 font-medium">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats Section */}
        {insurances.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <QuickStats insurances={insurances} />
          </motion.div>
        )}

        {/* Main Content Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Policies Header */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-mycol-nyanza/30 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-mycol-mint/10 rounded-xl">
                  <Shield className="w-6 h-6 text-mycol-mint" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Active Policies
                </h2>
              </div>
              {insurances.length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 bg-mycol-mint/10 rounded-full"
                >
                  <span className="text-mycol-mint font-semibold">
                    {insurances.length}{" "}
                    {insurances.length === 1 ? "Policy" : "Policies"}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Policies Content */}
          <div className="p-8">
            {insurances.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="bg-mycol-nyanza/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-mycol-mint" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Active Insurances
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You don't have any active insurance policies at the moment.
                  Browse our available plans to get started.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/insurance")}
                  className="px-8 py-3 bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Browse Insurance Plans
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {insurances.map((insurance, index) => (
                  <motion.div
                    key={insurance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InsuranceCard insurance={insurance} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-mycol-nyanza/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-mycol-mint" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Need Help?
                </h3>
                <p className="text-gray-600">
                  Our support team is here to assist you with any questions
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FarmerInsurances;
