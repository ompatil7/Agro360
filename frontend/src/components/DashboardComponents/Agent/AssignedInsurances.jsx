// components/DashboardComponents/AssignedInsurances.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AssignedInsurances = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try
            {
                const response = await axios.get('/api/v1/assign/my-assigned', { withCredentials: true });
                console.log(response);
                setAssignments(response.data.data.assignments);
            } catch (error)
            {
                toast.error(error.response?.data?.message || 'Failed to fetch assignments');
            } finally
            {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    if (loading)
    {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mycol-dartmouth_green"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-mycol-dartmouth_green">My Assigned Insurances</h2>

            {assignments.length === 0 ? (
                <p className="text-gray-600">No assignments found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment._id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-mycol-dartmouth_green">
                                    {assignment.insurancePolicy.name}
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Farmer:</span> {assignment.farmer.name}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Location:</span>{' '}
                                        {assignment.region.district}, {assignment.region.state}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Visit Date:</span>{' '}
                                        {new Date(assignment.visitDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className="capitalize">{assignment.status}</span>
                                    </p>
                                </div>

                                <Link
                                    to={`/profile/assigned-insurances/${assignment._id}`}
                                    className="inline-block px-4 py-2 bg-mycol-dartmouth_green text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignedInsurances;