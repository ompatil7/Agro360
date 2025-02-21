import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserTie, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AssignAgents = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [agentId, setAgentId] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [assignmentsData, setAssignmentsData] = useState([]);
    const [availableAgents, setAvailableAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);



    // Fetch all pending assignments
    useEffect(() => {
        async function getInsuranceAssignments() {
            setIsLoading(true);
            try
            {
                const response = await axios.get('/api/v1/assign', {
                    params: { status: 'pending' },
                    withCredentials: true
                });
                setAssignmentsData(response.data.data.assignments);
            } catch (err)
            {
                toast.error(err.response?.data?.message || 'Failed to fetch assignments');
            } finally
            {
                setIsLoading(false);
            }
        }
        getInsuranceAssignments();
    }, []);

    // Fetch available agents when modal opens
    // Add toast notifications for other actions as well:
    const handleOpenModal = async (data) => {
        setSelectedData(data);
        try
        {
            const response = await axios.get(`/api/v1/assign/available-agents/${data._id}`, {
                withCredentials: true
            });
            setAvailableAgents(response.data.data.agents);
            setShowModal(true);

            if (response.data.data.agents.length === 0)
            {
                toast.warning('No agents available in this region', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: '1px solid #D97706',
                    },
                    icon: '⚠️',
                });
            }
        } catch (err)
        {
            toast.error('Failed to fetch available agents', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: '1px solid #DC2626',
                },
                icon: '❌',
            });
        }
    };

    const handleCloseModal = () => {
        setSelectedData(null);
        setShowModal(false);
        setAgentId("");
        setVisitDate("");
        setAvailableAgents([]);
    };

    const handleAssignAgent = async () => {
        if (!agentId || !visitDate)
        {
            toast.error('Please select an agent and visit date', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: '1px solid #DC2626',
                },
            });
            return;
        }

        setIsSubmitting(true);
        try
        {
            await axios.patch(
                `/api/v1/assign/assign-agent/${selectedData._id}`,
                {
                    agentId,
                    visitDate
                },
                { withCredentials: true }
            );

            // Success Toast
            toast.success(
                <div className="flex flex-col">
                    <span className="font-medium">Agent Assigned Successfully!</span>
                    <span className="text-sm">Visit scheduled for {new Date(visitDate).toLocaleDateString()}</span>
                </div>,
                {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        background: '#ECFDF5',
                        color: '#065F46',
                        border: '1px solid #059669',
                    },
                    icon: '✅',
                }
            );

            // Refresh the assignments list
            const response = await axios.get('/api/v1/assign', {
                params: { status: 'pending' },
                withCredentials: true
            });
            setAssignmentsData(response.data.data.assignments);
            handleCloseModal();
        } catch (err)
        {
            toast.error(
                <div className="flex flex-col">
                    <span className="font-medium">Failed to assign agent</span>
                    <span className="text-sm">{err.response?.data?.message || 'Please try again'}</span>
                </div>,
                {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        background: '#FEE2E2',
                        color: '#DC2626',
                        border: '1px solid #DC2626',
                    },
                    icon: '❌',
                }
            );
        } finally
        {
            setIsSubmitting(false);
        }
    };




    if (isLoading)
    {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mycol-mint"></div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Assign Agents</h1>
                <p className="mt-2 text-gray-600">Manage insurance assignments and agent allocation</p>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                {assignmentsData.map((data, index) => (
                    <motion.div
                        key={data._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        {/* Status Badge */}
                        <div className="bg-mycol-mint/10 px-4 py-2">
                            <span className="text-mycol-mint text-sm font-medium">
                                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                {data.insurancePolicy.name}
                            </h3>

                            {/* Farmer Details */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <span className="mr-2 text-mycol-dark_green">Farmer Details</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaUserTie className="w-4 h-4 mr-2 text-mycol-mint" />
                                    <span>{data.farmer.name}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaEnvelope className="w-4 h-4 mr-2 text-mycol-mint" />
                                    <span>{data.farmer.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaPhoneAlt className="w-4 h-4 mr-2 text-mycol-mint" />
                                    <span>{data.farmer.phone}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-mycol-mint" />
                                    <span>{data.region.state}, {data.region.district}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenModal(data)}
                                className="w-full bg-mycol-mint text-white font-medium py-2 px-4 rounded-lg hover:bg-mycol-mint-2 transition-colors duration-200 flex items-center justify-center"
                            >
                                <FaUserTie className="mr-2" />
                                Assign Agent
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div >

            {/* Modal */}
            {
                showModal && selectedData && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50" onClick={handleCloseModal}></div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white w-full max-w-4xl mx-auto rounded-xl shadow-xl p-8 z-10 overflow-y-auto max-h-[90vh]"
                        >
                            {/* Modal content */}
                            <div className="mb-6 pb-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-900">Assign Agent</h2>
                                <p className="text-gray-600 mt-1">Select an agent and schedule a visit</p>
                            </div>

                            {/* Assignment Details */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Insurance Policy</label>
                                    <p className="text-gray-900 font-medium">{selectedData.insurancePolicy.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-600">Farmer</label>
                                    <p className="text-gray-900 font-medium">{selectedData.farmer.name}</p>
                                </div>
                                {/* Add more details as needed */}
                            </div>

                            {/* Available Agents */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Agents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableAgents.map((agent) => (
                                        <div
                                            key={agent._id}
                                            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${agentId === agent._id
                                                ? 'border-mycol-mint bg-mycol-mint/10'
                                                : 'border-gray-200 hover:border-mycol-mint/50'
                                                }`}
                                            onClick={() => setAgentId(agent._id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-mycol-mint/20 flex items-center justify-center">
                                                        <FaUserTie className="w-5 h-5 text-mycol-mint" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{agent.name}</p>
                                                    <p className="text-sm text-gray-500">{agent.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visit Date */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Schedule Visit Date
                                </label>
                                <input
                                    type="date"
                                    value={visitDate}
                                    onChange={(e) => setVisitDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignAgent}
                                    disabled={isSubmitting || !agentId || !visitDate}
                                    className="px-6 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                                            Assigning...
                                        </>
                                    ) : (
                                        'Assign Agent'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </>
    );
};

export default AssignAgents;