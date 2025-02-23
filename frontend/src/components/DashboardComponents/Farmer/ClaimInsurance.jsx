// components/DashboardComponents/Farmer/ClaimInsurance.jsx
import React, { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  Loader2,
  MapPin,
  ThermometerSun,
  Droplets,
  AlertCircle,
  CheckCircle,
  ImagePlus,
  Cloud,
  Eye,
  FileWarning,
} from "lucide-react";
import Webcam from "react-webcam";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const containerAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { staggerChildren: 0.1 },
};

const WeatherCard = ({ title, value, icon: Icon, unit }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center space-x-3 mb-3">
      <div className="p-2 bg-mycol-nyanza rounded-lg">
        <Icon className="w-6 h-6 text-mycol-mint" />
      </div>
      <h4 className="font-medium text-gray-700">{title}</h4>
    </div>
    <p className="text-3xl font-bold text-gray-900 flex items-end">
      {value}
      <span className="text-base text-gray-500 ml-1 mb-1">{unit}</span>
    </p>
  </motion.div>
);

// Enhanced ThresholdResult component
const ThresholdResult = ({ satisfied, message }) => (
  <motion.div
    whileHover={{ x: 10 }}
    className={`flex items-start space-x-3 p-5 rounded-xl border ${
      satisfied
        ? "bg-green-50/50 border-green-200"
        : "bg-red-50/50 border-red-200"
    }`}
  >
    {satisfied ? (
      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
    ) : (
      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
    )}
    <p className={`text-base ${satisfied ? "text-green-700" : "text-red-700"}`}>
      {message}
    </p>
  </motion.div>
);

const ClaimInsurance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimResponse, setClaimResponse] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Camera functions
  const handleCameraCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to file
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `camera_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setPhotos((prev) => [...prev, { file, preview: imageSrc }]);
        });
    }
  }, [webcamRef]);

  // File upload functions
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [
          ...prev,
          {
            file,
            preview: reader.result,
            name: file.name,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }

    try {
      setLoading(true);
      const coordinates = await getCurrentLocation();

      const formData = new FormData();
      formData.append("geolocation[type]", "Point");
      formData.append("geolocation[coordinates][]", coordinates[0]);
      formData.append("geolocation[coordinates][]", coordinates[1]);

      photos.forEach(({ file }) => {
        formData.append("photos", file);
      });

      const response = await axios.post(`/api/v1/claim/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setClaimResponse(response.data);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageTransition}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div
          variants={containerAnimation}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-mycol-nyanza rounded-xl">
              <FileWarning className="w-8 h-8 text-mycol-mint" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Submit Insurance Claim
              </h1>
              <p className="text-gray-600 text-lg">
                Document your crop damage with photos to process your claim
              </p>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Photo Upload Section */}
        <motion.div
          variants={containerAnimation}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Upload Evidence
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Camera/Upload Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCamera((prev) => !prev)}
                className="w-full py-4 px-6 bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Camera className="w-6 h-6" />
                <span className="text-lg font-medium">
                  {showCamera ? "Close Camera" : "Open Camera"}
                </span>
              </motion.button>

              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 bg-white border-2 border-mycol-mint text-mycol-mint rounded-xl hover:bg-mycol-mint hover:text-white transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-lg font-medium">Upload Photos</span>
                </motion.button>
              </div>
            </div>

            {/* Camera Preview with enhanced styling */}
            <div className="relative rounded-xl overflow-hidden shadow-inner bg-gray-100">
              {showCamera ? (
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-xl"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCameraCapture}
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-mycol-mint text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capture Photo</span>
                  </motion.button>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
                  <Camera className="w-12 h-12 mb-4" />
                  <p className="text-lg">Camera preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Photo Preview Grid */}
          {photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Selected Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-4 gap-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative group"
                  >
                    <img
                      src={photo.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-64 object-cover rounded-xl shadow-md"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Submit Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading || photos.length === 0}
            className="px-10 py-4 bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">Processing...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-lg">Submit Claim</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Claim Response */}
        {claimResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Banner */}
            <div
              className={`p-6 rounded-xl ${
                claimResponse.claim.status === "approved"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {claimResponse.claim.status === "approved" ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Claim{" "}
                      {claimResponse.claim.status === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Submitted on{" "}
                      {new Date(
                        claimResponse.claim.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    claimResponse.claim.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {claimResponse.claim.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Weather Data */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Weather Conditions
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <WeatherCard
                  title="Temperature"
                  value={claimResponse.currentWeather.temperature.toFixed(1)}
                  unit="°C"
                  icon={ThermometerSun}
                />
                <WeatherCard
                  title="Humidity"
                  value={claimResponse.currentWeather.humidity}
                  unit="%"
                  icon={Droplets}
                />
                <WeatherCard
                  title="Rainfall"
                  value={claimResponse.currentWeather.rainfall}
                  unit="mm"
                  icon={Cloud}
                />
              </div>
            </div>

            {/* Threshold Results */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Threshold Analysis
              </h3>
              <div className="space-y-4">
                {claimResponse.thresholdResults.notes.map((note, index) => (
                  <ThresholdResult
                    key={index}
                    satisfied={note.includes("✔")}
                    message={note}
                  />
                ))}
              </div>
            </div>

            {/* Location Verification */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location Verification
              </h3>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-mycol-mint flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                    Coordinates:{" "}
                    {claimResponse.claim.geolocation.coordinates.join(", ")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {claimResponse.claim.note.split("|")[1].trim()}
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Photos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Submitted Photos
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {claimResponse.claim.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Claim photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <a
                      href={photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => navigate("/profile/my-insurances")}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Insurances
              </button>
              {claimResponse.claim.status === "rejected" && (
                <button
                  onClick={() => {
                    setPhotos([]);
                    setClaimResponse(null);
                  }}
                  className="px-6 py-2 text-mycol-mint hover:text-mycol-mint-2 transition-colors"
                >
                  Submit New Claim
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ClaimInsurance;
