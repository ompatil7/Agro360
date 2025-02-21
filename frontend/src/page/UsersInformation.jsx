import React, { useEffect, useState } from "react";
import MapWithStoreLocations from "../components/Map/MapWithStoreLocation";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal"; // Assuming a Modal component is available

const UsersInformation = () => {
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:3000/api/v1/farm/${id}`
        );
        setFarmerData(response.data.data.farmer);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching farmer data:", err);
        setError("Failed to fetch farmer data");
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const coordinates = farmerData.location.coordinates;

  return (
    <div className="mx-auto max-w-screen-xl p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-500">Farmer Details</h1>
        <hr className="border-t-4 border-blue-600 mx-auto w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Farmer Information
          </h2>

          {/* Farmer Photo */}
          <div className="flex justify-center mb-6">
            <img
              src={farmerData.farmer.photo || "/default-profile.jpg"}
              alt={farmerData.farmer.name}
              className="rounded-full w-40 h-40 border-4 border-blue-500 object-cover"
            />
          </div>

          {/* Farmer Details */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Name:</span>
              <span className="text-gray-600">{farmerData.farmer.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-gray-600">{farmerData.farmer.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">City:</span>
              <span className="text-gray-600">{farmerData.location.city}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">State:</span>
              <span className="text-gray-600">{farmerData.location.state}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Address:</span>
              <span className="text-gray-600">
                {farmerData.location.address}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Policy Name:</span>
              <span className="text-gray-600">
                {farmerData.insurance.policy_name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Premium:</span>
              <span className="text-gray-600">
                ₹{farmerData.insurance.premium}
              </span>
            </div>

            {/* Description */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Description:</span>
              <button
                className="text-blue-600 hover:underline ml-1"
                onClick={() => setIsDescriptionModalOpen(true)}
              >
                View More
              </button>
            </div>

            {/* Terms and Conditions */}
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Terms and Conditions:
              </span>
              <button
                className="text-blue-600 hover:underline ml-1"
                onClick={() => setIsTermsModalOpen(true)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 h-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Farmer's Location
          </h2>
          <MapWithStoreLocations
            storeLocations={[
              {
                name: farmerData.farmer.name,
                locations: { coordinates },
              },
            ]}
          />
        </div>
      </div>

      {/* Modals */}
      {isTermsModalOpen && (
        <Modal
          onClose={() => setIsTermsModalOpen(false)}
          title="Terms and Conditions"
        >
          <p className="text-gray-700 whitespace-pre-wrap">
            {farmerData.insurance.terms_conditions}
          </p>
        </Modal>
      )}

      {isDescriptionModalOpen && (
        <Modal
          onClose={() => setIsDescriptionModalOpen(false)}
          title="Description"
        >
          <p className="text-gray-700 whitespace-pre-wrap">
            {farmerData.location.description}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default UsersInformation;
