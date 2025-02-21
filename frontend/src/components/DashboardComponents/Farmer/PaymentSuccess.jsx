// components/DashboardComponents/Farmer/PaymentSuccess.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const recordPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const enrollmentId = params.get("enrollment");
        const userId = params.get("user");
        const premium = params.get("premium");

        if (!enrollmentId || !userId || !premium) {
          throw new Error("Missing payment parameters");
        }

        // Call API to record payment
        const response = await axios.get(
          `/api/v1/payment/booking?enrollment=${enrollmentId}&user=${userId}&premium=${premium}`,
          { withCredentials: true }
        );

        if (response.data.status === "success") {
          setPaymentData(response.data.data.payment);
          toast.success("Premium payment successful!");
        } else {
          throw new Error("Failed to record payment");
        }
      } catch (err) {
        console.error("Payment recording error:", err);
        setError(err.message || "An error occurred recording your payment");
        toast.error("There was an issue recording your payment");
      } finally {
        setLoading(false);
      }
    };

    recordPayment();
  }, [location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-mycol-mint mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Your Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your premium payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] max-w-2xl mx-auto px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Verification Issue
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600 mb-6">
            Your payment may have been processed successfully, but we couldnt
            update our records. Please contact support and provide your policy
            details.
          </p>
          <button
            onClick={() => navigate("/profile/my-insurances")}
            className="bg-mycol-mint text-white px-6 py-3 rounded-xl font-medium hover:bg-mycol-mint/90"
          >
            Return to My Insurances
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-[70vh] max-w-2xl mx-auto px-4"
    >
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-8">
          Your insurance premium has been paid successfully.
        </p>

        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-sm text-gray-500">Policy Name</p>
              <p className="font-medium text-gray-900">
                {paymentData?.policyDetails?.policyName}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Policy Number</p>
              <p className="font-medium text-gray-900">
                {paymentData?.policyDetails?.policyNumber}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Premium Amount</p>
              <p className="font-medium text-gray-900">
                ₹{paymentData?.policyDetails?.premium?.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Payment Date</p>
              <p className="font-medium text-gray-900">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/profile/my-insurances")}
            className="bg-mycol-mint text-white px-6 py-3 rounded-xl font-medium hover:bg-mycol-mint/90 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            My Insurances
          </button>
          <button
            onClick={() =>
              navigate(`/profile/my-insurances/${paymentData?.enrollement}`)
            }
            className="bg-white border border-mycol-mint text-mycol-mint px-6 py-3 rounded-xl font-medium hover:bg-mycol-nyanza/20"
          >
            View Policy Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;
