// components/DashboardComponents/Farmer/InsuranceDetails.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as turf from "@turf/turf";
import { motion } from "framer-motion";
import {
  Shield,
  Calendar,
  FileText,
  MapPin,
  User,
  Crop,
  AlertCircle,
  Loader2,
  ArrowLeft,
  IndianRupee,
  Clock,
  CheckCircle,
  ThermometerSun,
  Droplets,
  Wind,
  FileWarning,
  Scale,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

// Utility function for date formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Update the InfoSection component
const InfoSection = ({ title, icon: Icon, children }) => (
  <motion.div
    variants={fadeInUp}
    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-mycol-nyanza to-mycol-mint rounded-xl flex items-center justify-center transform rotate-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
        {title}
      </h2>
    </div>
    {children}
  </motion.div>
);

// Update the DetailRow component
const DetailRow = ({ label, value, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-4 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
  >
    {Icon && <Icon className="w-5 h-5 text-mycol-mint flex-shrink-0" />}
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  </motion.div>
);

// Update the ThresholdCard component
const ThresholdCard = ({ title, min, max, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gradient-to-br from-mycol-nyanza/20 to-white rounded-xl p-5 border border-mycol-mint/20 shadow-sm"
  >
    <div className="flex items-center space-x-3 mb-4">
      <Icon className="w-6 h-6 text-mycol-mint" />
      <h4 className="font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Minimum</span>
        <span className="font-bold text-mycol-mint">{min}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Maximum</span>
        <span className="font-bold text-mycol-mint">{max}</span>
      </div>
    </div>
  </motion.div>
);

const InsuranceDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try
      {
        const response = await axios.get(`/api/v1/track/single/${id}`, {
          withCredentials: true,
        });
        setInsurance(response.data.data.final);
      } catch (error)
      {
        console.error("Error fetching insurance details:", error);
        setError("Failed to fetch insurance details");
        toast.error("Failed to fetch insurance details");
      } finally
      {
        setLoading(false);
      }
    };

    fetchInsuranceDetails();
  }, [id]);

  // Map initialization effect
  useEffect(() => {
    if (!map.current && mapContainer.current && insurance)
    {
      maptilersdk.config.apiKey = "DrLHBz4sGQJTXNNCWdc3";
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: insurance.farmDetails.geolocation.coordinates,
        zoom: 14,
      });

      map.current.on("load", () => {
        // Add marker
        new maptilersdk.Marker()
          .setLngLat(insurance.farmDetails.geolocation.coordinates)
          .addTo(map.current);

        // Create and add circle
        const circle = turf.circle(
          insurance.farmDetails.geolocation.coordinates,
          insurance.farmDetails.radius / 1000,
          { steps: 64, units: "kilometers" }
        );

        map.current.addSource("circle-source", {
          type: "geojson",
          data: circle,
        });

        map.current.addLayer({
          id: "circle-fill",
          type: "fill",
          source: "circle-source",
          paint: {
            "fill-color": "#40916c",
            "fill-opacity": 0.2,
          },
        });

        map.current.addLayer({
          id: "circle-outline",
          type: "line",
          source: "circle-source",
          paint: {
            "line-color": "#40916c",
            "line-width": 2,
          },
        });
      });
    }

    return () => {
      if (map.current)
      {
        map.current.remove();
        map.current = null;
      }
    };
  }, [insurance]);

  if (loading)
  {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-mycol-mint mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading insurance details...</p>
        </div>
      </div>
    );
  }

  if (error)
  {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }
  const handlePayPremium = async () => {
    try
    {
      // Show loading toast
      const loadingToast = toast.loading("Initializing payment...");

      // Call the API to get the checkout session
      const response = await axios.get(
        `/api/v1/payment/checkout-session/${insurance._id}`,
        { withCredentials: true }
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.data.status === "success")
      {
        // Redirect to Stripe Checkout
        window.location.href = response.data.session.url;
      } else
      {
        toast.error("Could not initialize payment");
      }
    } catch (error)
    {
      console.error("Payment initialization error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initialize payment"
      );
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen"
    >
      {/* Header Section with enhanced styling */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Insurance Details
              </h1>
              <p className="text-gray-600">
                View complete information about your insurance policy
              </p>
            </div>
          </div>
          {user.role === "user" && (
            <>
              {insurance.payment !== "done" && <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePayPremium}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <IndianRupee className="w-5 h-5 mr-2" />
                <span>Pay Premium</span>
              </motion.button>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate(`/profile/claim-insurance/${insurance._id}`)
                }
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <FileWarning className="w-5 h-5" />
                <span>Claim Insurance</span>
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-3 gap-8"
      >
        {/* Left Column - Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Policy Overview */}
          <InfoSection title="Policy Overview" icon={Shield}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {insurance.policyDetails.policyName}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-mycol-mint" />
                  Policy #{insurance.policyDetails.policyNumber}
                </p>
                <div className="bg-mycol-nyanza/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Sum Insured</span>
                    <span className="text-xl font-bold text-mycol-mint">
                      ₹
                      {insurance.policyDetails.sumInsured.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Premium</span>
                    <span className="text-xl font-bold text-mycol-mint">
                      ₹{insurance.policyDetails.premium.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Season Period</h4>
                <div className="space-y-2">
                  <DetailRow
                    label="Start Date"
                    value={formatDate(
                      insurance.policyDetails.seasonDates.startDate
                    )}
                    icon={Calendar}
                  />
                  <DetailRow
                    label="End Date"
                    value={formatDate(
                      insurance.policyDetails.seasonDates.endDate
                    )}
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
          </InfoSection>

          {/* Farm Location and Details */}
          <InfoSection title="Farm Location" icon={MapPin}>
            <div className="h-[400px] rounded-lg overflow-hidden mb-6">
              <div ref={mapContainer} className="w-full h-full" />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <DetailRow
                label="Area Size"
                value={`${insurance.farmDetails.areaSize} meters`}
                icon={Scale}
              />
              <DetailRow
                label="Irrigation Type"
                value={insurance.farmDetails.irrigationType}
                icon={Droplets}
              />
              <DetailRow
                label="Coverage Radius"
                value={`${insurance.farmDetails.radius} meters`}
                icon={MapPin}
              />
            </div>
          </InfoSection>

          {/* Crop Details and Thresholds */}
          <InfoSection title="Crop Information" icon={Crop}>
            {insurance.cropDetails.map((crop, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {crop.cropCategory}
                  </h3>
                  <span className="px-4 py-2 bg-mycol-nyanza/20 rounded-full text-mycol-mint">
                    {crop.crops[0].cropType}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <ThresholdCard
                    title="Temperature"
                    min={`${crop.crops[0].thresholds.temperature.minTemperature}°C`}
                    max={`${crop.crops[0].thresholds.temperature.maxTemperature}°C`}
                    icon={ThermometerSun}
                  />
                  <ThresholdCard
                    title="Rainfall"
                    min={`${crop.crops[0].thresholds.rainfall.minRainfall}mm`}
                    max={`${crop.crops[0].thresholds.rainfall.maxRainfall}mm`}
                    icon={Droplets}
                  />
                  <ThresholdCard
                    title="Humidity"
                    min={`${crop.crops[0].thresholds.humidity.minHumidity}%`}
                    max={`${crop.crops[0].thresholds.humidity.maxHumidity}%`}
                    icon={Wind}
                  />
                </div>
              </div>
            ))}
          </InfoSection>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Agent Information */}
          <InfoSection title="Assigned Agent" icon={User}>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-mycol-nyanza rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-mycol-mint" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {insurance.agent.name}
                  </h4>
                  <p className="text-gray-600">{insurance.agent.phone}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <DetailRow
                  label="Address"
                  value={`${insurance.agent.address.street}, ${insurance.agent.address.city}`}
                  icon={Home}
                />
              </div>
            </div>
          </InfoSection>

          {/* Claim Criteria */}
          <InfoSection title="Claim Criteria" icon={FileWarning}>
            {insurance.insurancePolicy.claimCriteria.map((criteria, index) => (
              <div key={index} className="space-y-3">
                <DetailRow
                  label="Damage Type"
                  value={criteria.damageType.replace("_", " ").toUpperCase()}
                />
                <DetailRow
                  label="Minimum Damage"
                  value={`${criteria.minimumDamagePercentage}%`}
                />
                <DetailRow
                  label="Compensation"
                  value={`${criteria.compensationPercentage}%`}
                />
              </div>
            ))}
          </InfoSection>

          {/* Required Documents */}
          <InfoSection title="Required Documents" icon={FileText}>
            <ul className="space-y-2">
              {insurance.insurancePolicy.eligibility.requiredDocuments.map(
                (doc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{doc}</span>
                  </li>
                )
              )}
            </ul>
          </InfoSection>

          {/* Timeline */}
          <InfoSection title="Important Dates" icon={Clock}>
            <div className="space-y-4">
              <DetailRow
                label="Enrollment Date"
                value={formatDate(insurance.enrollmentDate)}
              />
              <DetailRow
                label="Visit Date"
                value={formatDate(insurance.insuranceAssignment.visitDate)}
              />
              <DetailRow
                label="Application Date"
                value={formatDate(
                  insurance.insuranceAssignment.applicationDate
                )}
              />
            </div>
          </InfoSection>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default InsuranceDetails;
