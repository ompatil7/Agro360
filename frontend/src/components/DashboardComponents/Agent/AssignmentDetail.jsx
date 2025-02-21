// components/DashboardComponents/Agent/AssignmentDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    MapPin,
    Droplet,
    Crop,
    FileText,
    Loader2,
    CheckCircle,
    AlertCircle,
    X,
    ChevronRight,
    Calendar
} from 'lucide-react';
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as turf from '@turf/turf';
import { motion, AnimatePresence } from 'framer-motion';


const AssignmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [farmVisits, setFarmVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try
            {
                // Fetch farm visits
                const visitsResponse = await axios.get(`/api/v1/track/farmer/${id}`, {
                    withCredentials: true
                });
                console.log("visit", visitsResponse)
                setFarmVisits(visitsResponse.data.data.farmVisits);
            } catch (error)
            {
                toast.error(error.response?.data?.message || 'Failed to fetch details');
            } finally
            {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!map.current && mapContainer.current && farmVisits.length > 0)
        {
            maptilersdk.config.apiKey = "DrLHBz4sGQJTXNNCWdc3";
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: farmVisits[0].geolocation.coordinates,
                zoom: 12
            });

            map.current.on('load', () => {
                // Add markers and circles for all farm visits
                farmVisits.forEach(visit => {
                    // Add marker
                    new maptilersdk.Marker()
                        .setLngLat(visit.geolocation.coordinates)
                        .addTo(map.current);

                    // Create circle using turf.js
                    const circle = turf.circle(
                        visit.geolocation.coordinates,
                        visit.radius / 1000, // Convert meters to kilometers
                        { steps: 64, units: 'kilometers' }
                    );

                    // Add circle source
                    const sourceId = `circle-source-${visit._id}`;
                    if (!map.current.getSource(sourceId))
                    {
                        map.current.addSource(sourceId, {
                            type: 'geojson',
                            data: circle
                        });

                        // Add fill layer
                        map.current.addLayer({
                            id: `circle-fill-${visit._id}`,
                            type: 'fill',
                            source: sourceId,
                            paint: {
                                'fill-color': '#40916c',
                                'fill-opacity': 0.2
                            }
                        });

                        // Add outline layer
                        map.current.addLayer({
                            id: `circle-outline-${visit._id}`,
                            type: 'line',
                            source: sourceId,
                            paint: {
                                'line-color': '#40916c',
                                'line-width': 2
                            }
                        });
                    }
                });

                // Fit map to show all visits
                if (farmVisits.length > 1)
                {
                    const bounds = new maptilersdk.LngLatBounds();
                    farmVisits.forEach(visit => {
                        bounds.extend(visit.geolocation.coordinates);
                    });
                    map.current.fitBounds(bounds, { padding: 50 });
                }
            });
        }

        // Cleanup function
        return () => {
            if (map.current)
            {
                map.current.remove();
                map.current = null;
            }
        };
    }, [farmVisits]);

    const handleConfirmEnrollment = async () => {
        if (!selectedVisit) return;

        try
        {
            setSubmitting(true);
            await axios.post(`/api/v1/track/${id}`, {
                farmVisitId: selectedVisit._id
            }, {
                withCredentials: true
            });
            toast.success('Policy enrollment submitted successfully');
            navigate('/profile/assigned-insurances');
        } catch (error)
        {
            toast.error(error.response?.data?.message || 'Failed to submit enrollment');
        } finally
        {
            setSubmitting(false);
            setShowConfirmation(false);
        }
    };

    const ConfirmationModal = () => (
        <AnimatePresence>
            {showConfirmation && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        className="bg-white rounded-xl p-6 max-w-lg w-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Confirm Policy Enrollment
                            </h3>
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-mycol-nyanza/20 rounded-lg">
                                <p className="text-gray-700">
                                    You are about to submit a policy enrollment for:
                                </p>
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm text-gray-600">
                                        Visit ID: {selectedVisit?.visitIdentifier}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Area: {selectedVisit?.farmDetails.areaSize} meters
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Location: {selectedVisit?.geolocation.coordinates.join(', ')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmEnrollment}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Confirm Enrollment</span>
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (loading)
    {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-mycol-dartmouth_green mx-auto" />
                    <p className="mt-4 text-gray-600">Loading farm visits...</p>
                </div>
            </div>
        );
    }

    // Update the main return section
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-[1800px] mx-auto"> {/* Further increased max width */}
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Farm Visits</h1>
                    <button
                        onClick={() => navigate('/profile/assigned-insurances')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Back to Assignments
                    </button>
                </div>

                {/* Info Banner */}
                <div className="bg-mycol-nyanza/5 rounded-lg p-4 mb-6">
                    <p className="text-gray-600">
                        Select a farm visit to view details and submit for policy enrollment.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Farm Visits and Details Section */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Left Column - Farm Visit Cards */}
                        <div className="space-y-4 col-span-1">
                            {farmVisits.map((visit) => (
                                <motion.div
                                    key={visit._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white rounded-lg border-2 transition-all cursor-pointer
                                    ${selectedVisit?._id === visit._id
                                            ? 'border-mycol-mint shadow-lg'
                                            : 'border-gray-100 hover:border-mycol-mint/50'}`}
                                    onClick={() => setSelectedVisit(visit)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-center text-mycol-mint mb-3">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {new Date(visit.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-md  text-black- mb-3 font-medium">
                                            Farmer : {visit.visitIdentifier}
                                        </p>

                                        <div className="grid grid-rows-2 gap-4">
                                            <div className="flex items-center text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-mycol-mint" />
                                                <span className="text-md">
                                                    Coordinates : {visit.geolocation.coordinates.join(', ')}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-gray-700">
                                                <Crop className="w-4 h-4 mr-2 text-mycol-mint" />
                                                <span className="text-md">
                                                    Area size : {visit.farmDetails.areaSize} meters
                                                </span>
                                            </div>

                                            <div className="flex items-center text-gray-700">
                                                <Droplet className="w-4 h-4 mr-2 text-mycol-mint" />
                                                <span className="text-md">
                                                    Irrigation type : {visit.farmDetails.irrigationType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Column - Selected Visit Details */}
                        {selectedVisit && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-lg border border-gray-200 col-span-2"
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Visit Details
                                        </h2>
                                        <button
                                            onClick={() => setShowConfirmation(true)}
                                            className="px-6 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors flex items-center"
                                        >
                                            Submit Enrollment
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Crop Details */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                                Crop Details
                                            </h3>
                                            {selectedVisit.farmDetails.cropDetails.map((crop, index) => (
                                                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center mb-2">
                                                        <Crop className="w-5 h-5 text-mycol-mint mr-2" />
                                                        <h4 className="font-medium text-gray-700">
                                                            {crop.cropCategory}
                                                        </h4>
                                                    </div>
                                                    <ul className="ml-7 space-y-2">
                                                        {crop.crops.map((c, i) => (
                                                            <li key={i} className="text-gray-600 flex items-center">
                                                                <div className="w-2 h-2 bg-mycol-mint rounded-full mr-2" />
                                                                {c.cropType}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Farm Details */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">
                                                Farm Details
                                            </h3>
                                            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                                <div className="flex items-center">
                                                    <span className="text-gray-600 w-32">Area Size:</span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedVisit.farmDetails.areaSize} meters
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-600 w-32">Irrigation:</span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedVisit.farmDetails.irrigationType}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-600 w-32">Radius:</span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedVisit.radius} meters
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedVisit.notes && (
                                                <div className="mt-6">
                                                    <h4 className="text-gray-800 font-medium mb-2">Notes</h4>
                                                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                                        {selectedVisit.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Map Section - Full Width */}
                    <div
                        ref={mapContainer}
                        className="h-[500px] bg-white rounded-lg border border-gray-200 shadow-sm"
                    />
                </div>
            </div>

            <ConfirmationModal />
        </div>
    );
};
export default AssignmentDetail;