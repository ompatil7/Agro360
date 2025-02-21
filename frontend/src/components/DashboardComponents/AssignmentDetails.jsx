// components/DashboardComponents/AssignmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AssignmentDetail = () => {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        status: '',
        notes: '',
        visitDate: '',
    });

    useEffect(() => {
        const fetchAssignment = async () => {
            try
            {
                const response = await axios.get(`/api/v1/insurance-assignments/${id}`);
                setAssignment(response.data.data.assignment);
                setFormData({
                    status: response.data.data.assignment.status,
                    notes: response.data.data.assignment.notes || '',
                    visitDate: response.data.data.assignment.visitDate.split('T')[0],
                });
            } catch (error)
            {
                toast.error(error.response?.data?.message || 'Failed to fetch assignment details');
            } finally
            {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try
        {
            const response = await axios.patch(
                `/api/v1/insurance-assignments/update/${id}`,
                formData
            );
            setAssignment(response.data.data.assignment);
            toast.success('Assignment updated successfully');
        } catch (error)
        {
            toast.error(error.response?.data?.message || 'Failed to update assignment');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (loading)
    {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mycol-dartmouth_green"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-mycol-dartmouth_green mb-6">
                Assignment Details
            </h2>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        <span className="font-medium">Insurance:</span>{' '}
                        {assignment?.insurancePolicy.name}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Farmer:</span> {assignment?.farmer.name}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Location:</span>{' '}
                        {assignment?.region.district}, {assignment?.region.state}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Visit Date</label>
                        <input
                            type="date"
                            name="visitDate"
                            value={formData.visitDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded-md"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-mycol-dartmouth_green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Update Assignment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignmentDetail;