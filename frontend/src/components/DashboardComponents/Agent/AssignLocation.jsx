import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import axios from 'axios';
import debounce from 'lodash/debounce';
import toast from 'react-hot-toast';
import { ChevronDown, X } from 'lucide-react'

import * as turf from '@turf/turf';


const cropCategories = {
    Cereals: ["Wheat", "Rice", "Maize", "Barley", "Sorghum"],
    Pulses: ["Chickpea", "Lentil", "Pea", "PigeonPea"],
    Oilseeds: ["Mustard", "Sunflower", "Groundnut", "Soybean"],
    Vegetables: ["Tomato", "Potato", "Onion", "Cabbage", "Carrot"],
    Fruits: ["Mango", "Banana", "Apple", "Citrus", "Grapes"],
    FiberCrops: ["Cotton", "Jute"],
    SpicesAndPlantationCrops: ["Tea", "Coffee", "Pepper", "Cardamom"]
};

const AssignLocation = () => {
    const [formData, setFormData] = useState({
        farmer: '',
        farmDetails: {
            cropDetails: [],
            areaSize: '',
            irrigationType: ''
        },
        radius: '',
        geolocation: {
            type: 'Point',
            coordinates: []
        },
        notes: ''
    });

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const circleLayer = useRef(null);
    const [isLocationFetched, setIsLocationFetched] = useState(false);

    const [selectedCrops, setSelectedCrops] = useState({});
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [marker, setMarker] = useState(null);
    const [circle, setCircle] = useState(null);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    // Add these helper functions
    const handleCategorySelect = (category) => {
        if (!selectedCategories.includes(category))
        {
            setSelectedCategories([...selectedCategories, category]);
            setSelectedCrops({
                ...selectedCrops,
                [category]: []
            });
        }
        setShowCategoryDropdown(false);
    };

    const handleCropSelect = (category, crop) => {
        const updatedCrops = selectedCrops[category].includes(crop)
            ? selectedCrops[category].filter(c => c !== crop)
            : [...selectedCrops[category], crop];

        setSelectedCrops({
            ...selectedCrops,
            [category]: updatedCrops
        });

        // Update formData with proper format
        const newCropDetails = Object.entries(selectedCrops).map(([categoryName, crops]) => ({
            cropCategory: categoryName,
            crops: crops.map(cropType => ({ cropType }))
        }));

        setFormData(prev => ({
            ...prev,
            farmDetails: {
                ...prev.farmDetails,
                cropDetails: newCropDetails
            }
        }));
    };

    const removeCategory = (category) => {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
        const { [category]: removed, ...remainingCrops } = selectedCrops;
        setSelectedCrops(remainingCrops);
    };


    // Debounced search function
    const debouncedSearch = debounce(async (query) => {
        if (!query)
        {
            setSearchResults([]);
            return;
        }
        try
        {
            setIsLoading(true);
            const response = await axios.get(`/api/v1/users/search?q=${query}`);
            // Extract users array from the nested response
            const farmers = response.data?.data?.users || [];
            setSearchResults(farmers);
        } catch (error)
        {
            console.error('Search error:', error);
            toast.error('Error searching farmers');
            setSearchResults([]);
        } finally
        {
            setIsLoading(false);
        }
    }, 500);

    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };
    const handleFarmerSelect = (farmer) => {
        setSelectedFarmer(farmer);
        setFormData(prev => ({
            ...prev,
            farmer: farmer._id
        }));
        setSearchQuery(''); // Clear search after selection
        setSearchResults([]); // Clear results after selection
    };


    const SearchResults = () => {
        if (isLoading)
        {
            return (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-mycol-mint" />
                </div>
            );
        }

        if (searchQuery && searchResults.length === 0)
        {
            return (
                <div className="text-center py-4 text-gray-500">
                    No farmers found
                </div>
            );
        }

        return (
            <div className="mt-4 max-h-60 overflow-y-auto">
                {Array.isArray(searchResults) && searchResults.map((farmer) => (
                    <div
                        key={farmer._id}
                        onClick={() => handleFarmerSelect(farmer)}
                        className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-gray-800">{farmer.name}</p>
                                <p className="text-sm text-gray-600">{farmer.email}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                    <span>{farmer.phone}</span>
                                    {farmer.address && (
                                        <span className="ml-2">
                                            • {farmer.address.city}, {farmer.address.state}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="px-3 py-1 text-sm bg-mycol-nyanza text-mycol-mint rounded-full hover:bg-mycol-mint hover:text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFarmerSelect(farmer);
                                }}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    // Get current location
    const getCurrentLocation = () => {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    const coordinates = [longitude, latitude];
                    setCurrentLocation(coordinates);
                    setIsLocationFetched(true);

                    setFormData(prev => ({
                        ...prev,
                        geolocation: {
                            type: 'Point',
                            coordinates: coordinates
                        }
                    }));

                    // Update map
                    if (map.current)
                    {
                        // Remove existing marker if it exists
                        if (marker) marker.remove();

                        // Add new marker
                        const newMarker = new maptilersdk.Marker()
                            .setLngLat(coordinates)
                            .addTo(map.current);
                        setMarker(newMarker);

                        // Center map on location
                        map.current.setCenter(coordinates);
                        map.current.setZoom(15);

                        // Clear existing circle if area size is set
                        if (formData.farmDetails.areaSize)
                        {
                            updateMapCircle(coordinates, formData.farmDetails.areaSize);
                        }
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Failed to get location. Please try again.');
                }
            );
        } else
        {
            toast.error('Geolocation is not supported by your browser');
        }
    };


    // Update the useEffect for area size changes
    useEffect(() => {
        if (map.current && map.current.loaded() && isLocationFetched &&
            formData.farmDetails.areaSize && formData.geolocation.coordinates.length)
        {
            updateMapCircle(formData.geolocation.coordinates, formData.farmDetails.areaSize);
        }
    }, [formData.farmDetails.areaSize]);

    // Initialize map
    useEffect(() => {
        if (!map.current && mapContainer.current)
        {
            maptilersdk.config.apiKey = "DrLHBz4sGQJTXNNCWdc3";
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: [77.5946, 12.9716],
                zoom: 12
            });
        }
    }, []);

    const updateMapCircle = (center, radius) => {
        if (!map.current || !radius) return;

        try
        {
            // Remove existing circle source and layer if they exist
            if (map.current.getSource('circle-source'))
            {
                map.current.removeLayer('circle-fill');
                map.current.removeLayer('circle-outline');
                map.current.removeSource('circle-source');
            }

            // Create a circle feature using turf.js
            const options = { steps: 64, units: 'meters' };
            const circleFeature = turf.circle(center, parseFloat(radius), options);

            // Add the circle source
            map.current.addSource('circle-source', {
                type: 'geojson',
                data: circleFeature
            });

            // Add fill layer
            map.current.addLayer({
                id: 'circle-fill',
                type: 'fill',
                source: 'circle-source',
                paint: {
                    'fill-color': '#40916c',
                    'fill-opacity': 0.2
                }
            });

            // Add outline layer
            map.current.addLayer({
                id: 'circle-outline',
                type: 'line',
                source: 'circle-source',
                paint: {
                    'line-color': '#40916c',
                    'line-width': 2
                }
            });

            // Fit map to circle bounds
            const bounds = turf.bbox(circleFeature);
            map.current.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 }
            });

        } catch (error)
        {
            console.error('Error updating circle:', error);
            toast.error('Error updating area visualization');
        }
    };

    // Add this useEffect to handle map loading and circle updates
    useEffect(() => {
        if (map.current)
        {
            map.current.on('load', () => {
                if (isLocationFetched && formData.farmDetails.areaSize && formData.geolocation.coordinates.length)
                {
                    updateMapCircle(formData.geolocation.coordinates, formData.farmDetails.areaSize);
                }
            });
        }
    }, [map.current]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.farmer)
        {
            toast.error('Please select a farmer');
            return;
        }

        if (!formData.geolocation.coordinates.length)
        {
            toast.error('Please get location coordinates');
            return;
        }

        if (!formData.farmDetails.areaSize)
        {
            toast.error('Please enter area size');
            return;
        }

        try
        {
            setIsLoading(true);

            // Prepare the payload with correct format
            const payload = {
                farmer: formData.farmer,
                farmDetails: {
                    cropDetails: selectedCategories.map(category => ({
                        cropCategory: category,
                        crops: selectedCrops[category].map(crop => ({
                            cropType: crop
                        }))
                    })),
                    areaSize: Number(formData.farmDetails.areaSize), // Convert to number
                    irrigationType: formData.farmDetails.irrigationType
                },
                radius: Number(formData.farmDetails.areaSize), // Use areaSize as radius
                geolocation: {
                    type: "Point",
                    coordinates: formData.geolocation.coordinates
                },
                notes: formData.notes || ""
            };

            console.log('Submitting payload:', payload); // For debugging

            const response = await axios.post('/api/v1/location/', payload);
            toast.success('Location assigned successfully');

            // Reset form
            setFormData({
                farmer: '',
                farmDetails: {
                    cropDetails: [],
                    areaSize: '',
                    irrigationType: ''
                },
                radius: '',
                geolocation: {
                    type: 'Point',
                    coordinates: []
                },
                notes: ''
            });
            setSelectedCategories([]);
            setSelectedCrops({});
            setSelectedFarmer(null);
            setIsLocationFetched(false);

            // Clear map
            if (marker) marker.remove();
            if (circle) circle.remove();

        } catch (error)
        {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || 'Error assigning location');
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign Location</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Location Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Details</h3>
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="flex items-center space-x-2 px-4 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors"
                            >
                                <MapPin className="w-5 h-5" />
                                <span>Get My Location</span>
                            </button>
                        </div>

                        {/* Farm Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Farm Details</h3>

                            {/* Area Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Area Size (meters)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.farmDetails.areaSize}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                farmDetails: {
                                                    ...prev.farmDetails,
                                                    areaSize: value
                                                },
                                                radius: value
                                            }));
                                        }}
                                        disabled={!isLocationFetched}
                                        placeholder={isLocationFetched ? "Enter area size" : "Get location first"}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent
                ${!isLocationFetched ? 'bg-gray-50 cursor-not-allowed' : ''}
                ${isLocationFetched ? 'hover:border-mycol-mint' : ''}`}
                                        min={1}
                                        step={1}
                                    />
                                    {!isLocationFetched && (
                                        <div className="absolute right-3 top-2 text-gray-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {!isLocationFetched && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Please get your location first using the "Get My Location" button
                                    </p>
                                )}
                            </div>
                            {/* Crop Categories Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Crop Categories
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent flex justify-between items-center"
                                    >
                                        <span>Select Categories</span>
                                        <ChevronDown className="w-5 h-5" />
                                    </button>

                                    {showCategoryDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {Object.keys(cropCategories).map((category) => (
                                                <div
                                                    key={category}
                                                    onClick={() => handleCategorySelect(category)}
                                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    {category}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Categories and Crops */}
                                <div className="mt-4 space-y-4">
                                    {selectedCategories.map((category) => (
                                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium text-gray-800">{category}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCategory(category)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {cropCategories[category].map((crop) => (
                                                    <button
                                                        key={crop}
                                                        type="button"
                                                        onClick={() => handleCropSelect(category, crop)}
                                                        className={`px-3 py-1 rounded-full text-sm ${selectedCrops[category]?.includes(crop)
                                                            ? 'bg-mycol-mint text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {crop}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Irrigation Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Irrigation Type
                                </label>
                                <select
                                    value={formData.farmDetails.irrigationType}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        farmDetails: {
                                            ...formData.farmDetails,
                                            irrigationType: e.target.value
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                >
                                    <option value="">Select Irrigation Type</option>
                                    <option value="Drip">Drip</option>
                                    <option value="Sprinkler">Sprinkler</option>
                                    <option value="Surface">Surface</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        notes: e.target.value
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Right Column - Search and Map */}
                <div className="space-y-6">
                    {/* Search Section */}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Selected Farmer Display */}
                        {selectedFarmer && (
                            <div className="mb-4 p-4 bg-mycol-nyanza/20 rounded-lg border border-mycol-mint/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800">Selected Farmer:</p>
                                        <p className="text-sm text-gray-600">{selectedFarmer.name}</p>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <p>{selectedFarmer.email}</p>
                                            <p>{selectedFarmer.phone}</p>
                                            {selectedFarmer.address && (
                                                <p>{`${selectedFarmer.address.city}, ${selectedFarmer.address.state}`}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedFarmer(null);
                                            setFormData(prev => ({ ...prev, farmer: '' }));
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search farmers by name, email, or phone..."
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>

                        {/* Search Results Component */}
                        <SearchResults />
                    </div>

                    {/* Map */}
                    <div
                        ref={mapContainer}
                        className="h-[400px] bg-white rounded-xl shadow-sm border border-gray-100"
                    />
                </div>
            </div>
        </div>
    );
};

export default AssignLocation;