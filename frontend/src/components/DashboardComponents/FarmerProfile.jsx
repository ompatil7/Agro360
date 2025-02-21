import React from "react";
import { useParams } from "react-router-dom";

const FarmerProfile = () => {
  const { id } = useParams();

  // Sample data for the farmer profile (replace this with your API call or state data)
  const farmerData = {
    1: {
      name: "Neil Sims",
      city: "Pune",
      policyName: "Crop Insurance",
      contact: "neil.sims@example.com",
      details: "Detailed policy terms and conditions...",
    },
    2: {
      name: "Bonnie Green",
      city: "Nagpur",
      policyName: "Weather Protection",
      contact: "bonnie.green@example.com",
      details: "Detailed policy terms and conditions...",
    },
    3: {
      name: "Jese Leos",
      city: "Mumbai",
      policyName: "Crop Damage",
      contact: "jese.leos@example.com",
      details: "Detailed policy terms and conditions...",
    },
  };

  // Fetch the farmer's profile details based on the ID
  const farmer = farmerData[id];

  if (!farmer) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Farmer not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{farmer.name}</h1>
      <p className="mb-2">
        <span className="font-semibold">City:</span> {farmer.city}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Policy Name:</span> {farmer.policyName}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Contact:</span> {farmer.contact}
      </p>
      <p>
        <span className="font-semibold">Details:</span> {farmer.details}
      </p>
    </div>
  );
};

export default FarmerProfile;
