import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API requests
import userPhoto from "../../assets/avatars/user3.jpg";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch farmers data from the API
  useEffect(() => {
    const fetchFarmers = async () => {
      try
      {
        const response = await axios.get("/api/v1/farm");
        console.log("res", response);
        setFarmers(response.data.data.farmers); // Assuming the API response is an array of farmers
        setLoading(false);
      } catch (err)
      {
        setError("Failed to load farmers data");
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const handleViewMore = (id) => {
    navigate(`/profile/farmer-profile/${id}`); // Use the farmer's ID for dynamic routing
  };

  if (loading)
  {
    return <div>Loading farmers data...</div>;
  }

  if (error)
  {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-md text-gray-800 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Profile Photo & Name</th>
            <th className="px-6 py-3">City</th>
            <th className="px-6 py-3">Policy Name</th>
            <th className="px-6 py-3">Premium Status</th>
            <th className="px-6 py-3">Agent Name</th>
            <th className="px-6 py-3">Start Date</th>
            {/* <th className="px-6 py-3">End Date</th> */}
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((data) => (
            <tr
              key={data.farmer._id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="flex items-center px-6 py-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src={data.farmer.photo || "/default-avatar.png"} // Fallback to a default image
                  alt={`${data.farmer.name} profile`}
                />
                <div className="ml-3">
                  <div className="text-lg font-semibold text-gray-900 ">
                    {data.farmer.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-800 text-lg">
                {data.location.city}
              </td>
              <td className="px-6 py-4 text-black text-lg">
                {data.insurance.policy_name}
              </td>
              <td className="px-6 py-4">
                {/* <span
                  className={`px-3 py-1 text-sm font-semibold rounded ${
                    data.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {data.status}
                </span> */}
                <span className="px-3 py-1 text-lg font-semibold rounded bg-green-100 text-green-800">
                  Paid
                </span>
              </td>
              <td className="px-6 py-4 text-black text-lg">
                {data.agent.name}
              </td>
              <td className="px-6 py-4">
                {new Date(data.createdAt).toLocaleDateString("en-GB")}
              </td>

              {/* <td className="px-6 py-4">{data.endDate}</td> */}
              <td className="px-6 py-4">
                <button
                  onClick={() => handleViewMore(data._id)}
                  className="text-blue-600 dark:text-blue-500 hover:underline font-medium"
                >
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
