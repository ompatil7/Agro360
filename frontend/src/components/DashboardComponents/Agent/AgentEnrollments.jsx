// components/DashboardComponents/Agent/AgentEnrollments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar,
    User,
    FileText,
    MapPin,
    Loader2,
    ChevronRight,
    AlertCircle,
    Crop
} from 'lucide-react';
import toast from 'react-hot-toast';

const EnrollmentCard = ({ enrollment }) => {
    const navigate = useNavigate();
    const startDate = new Date(enrollment.policyDetails.seasonDates.startDate).toLocaleDateString();
    const endDate = new Date(enrollment.policyDetails.seasonDates.endDate).toLocaleDateString();

    return (
        <div
            onClick={() => navigate(`/profile/my-enrollments/${enrollment.id}`)}
            className="bg-white rounded-lg border border-gray-200 hover:border-mycol-mint transition-all cursor-pointer"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {enrollment.policyDetails.policyName}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Policy #{enrollment.policyDetails.policyNumber}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${enrollment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'}`}
                    >
                        {enrollment.status}
                    </span>
                </div>

                {/* Policy Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-mycol-mint" />
                        <div className="text-sm">
                            <p className="text-gray-600">Season Period</p>
                            <p className="font-medium text-gray-800">
                                {startDate} - {endDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-mycol-mint" />
                        <div className="text-sm">
                            <p className="text-gray-600">Premium</p>
                            <p className="font-medium text-gray-800">
                                ₹{enrollment.policyDetails.premium}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Farmer Details */}
                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-mycol-mint" />
                                <span className="text-sm font-medium text-gray-800">
                                    {enrollment.farmerDetails.name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-mycol-mint" />
                                <span className="text-sm text-gray-600">
                                    {enrollment.farmerDetails.address.district},
                                    {enrollment.farmerDetails.address.state}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Crop className="w-4 h-4 text-mycol-mint" />
                                <span className="text-sm text-gray-600">
                                    {enrollment.cropDetails[0].cropCategory} -
                                    {enrollment.cropDetails[0].crops[0].cropType}
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AgentEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try
            {
                const response = await axios.get('/api/v1/track/agentmy', {
                    withCredentials: true
                });
                setEnrollments(response.data.data.enrollments);
            } catch (error)
            {
                console.error('Error fetching enrollments:', error);
                setError('Failed to fetch enrollments');
                toast.error('Failed to fetch enrollments');
            } finally
            {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    if (loading)
    {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-mycol-mint" />
            </div>
        );
    }

    if (error)
    {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                <AlertCircle className="w-6 h-6 mr-2" />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Enrollments</h1>
                <p className="mt-2 text-gray-600">
                    View and manage your policy enrollments
                </p>
            </div>

            {enrollments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Enrollments Found</h3>
                    <p className="mt-2 text-gray-500">
                        You haven't processed any policy enrollments yet.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {enrollments.map((enrollment) => (
                        <EnrollmentCard
                            key={enrollment.id}
                            enrollment={enrollment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentEnrollments;