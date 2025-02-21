/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
// import { Link, Routes, Route } from "react-router-dom";
import ProcessingAnimation from "../ProcessingAnimation";
import DiseasesPanel from "./DiseasesPanel";
import axios from "axios";
import {
    Upload,
    AlertCircle,
    Check,
    Loader2,
    ShoppingCart,
    Sprout,
} from "lucide-react";

// todo : disease panel hidden on small screen

const DiseaseDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("en");



    const [processingStep, setProcessingStep] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Add this array for processing steps
    const processingSteps = [
        { id: 1, text: "Uploading image...", delay: 1000 },
        { id: 2, text: "Processing image...", delay: 2000 },
        { id: 3, text: "Analyzing image...", delay: 2000 },
        { id: 4, text: "Translating results...", delay: 1500 }
    ];

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
    };


    const handleSubmit = async () => {
        if (!selectedImage) return;

        setIsSubmitted(true);
        setError("");
        setProcessingStep(1);

        const formData = new FormData();
        const file = await fetch(selectedImage)
            .then(r => r.blob())
            .then(blobFile => new File([blobFile], "image.jpg", { type: "image/jpeg" }));

        formData.append("image", file);

        try
        {
            // Simulate steps with delays
            for (let step of processingSteps)
            {
                setProcessingStep(step.id);
                await new Promise(resolve => setTimeout(resolve, step.delay));
            }

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            };

            // Only add language parameter if it's not English
            if (selectedLanguage !== "en")
            {
                config.params = { lang: selectedLanguage };
            }

            const response = await axios.post(
                "/api/v1/crops/detect-crop-disease",
                formData,
                config
            );

            setPrediction(response.data.predictions[0]);
        } catch (error)
        {
            console.error("Error detecting crop disease:", error);
            setError("Failed to detect crop disease. Please try again.");
        } finally
        {
            setIsSubmitted(false);
            setProcessingStep(null);
        }
    };

    return (
        <>
            <div className="h-[calc(100vh-64px)] overflow-y-auto p-6 pr-80 flex flex-col">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Crop Disease Detection
                        </h1>
                        <p className="mt-2 text-gray-800">
                            Upload images of your crops for instant disease analysis
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-mycol-nyanza rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-mycol-mint" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Easy Upload</h3>
                            <p className="mt-2 text-sm text-gray-800">
                                Upload your crop images securely for instant analysis
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-mycol-nyanza rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-mycol-mint" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Quick Detection</h3>
                            <p className="mt-2 text-sm text-gray-800">
                                Get results within seconds using our AI technology
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-mycol-nyanza rounded-full flex items-center justify-center mb-4">
                                <Check className="w-6 h-6 text-mycol-mint" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Expert Analysis</h3>
                            <p className="mt-2 text-sm text-gray-800">
                                Receive detailed insights and treatment recommendations
                            </p>
                        </div>
                    </div>

                    {/* Main Detection Tool */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Disease Detection Tool
                            </h2>
                            <p className="mt-1 text-gray-800">
                                Upload a clear image of your crop for analysis
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Column - Upload and Controls */}
                                <div className="space-y-6">
                                    {!isSubmitted ? (
                                        <>
                                            {/* Upload Area */}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className="group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-mycol-celadon rounded-lg bg-mycol-nyanza/20 hover:bg-mycol-nyanza/30 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <Upload className="w-12 h-12 text-gray-800 mb-4 group-hover:scale-110 transition-transform duration-200" />
                                                    <span className="text-gray-800 font-medium">
                                                        Click to upload
                                                    </span>
                                                    <span className="text-sm text-gray-800 mt-2">
                                                        or drag and drop
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Language Selection */}
                                            {selectedImage && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-800 mb-2">
                                                            Select Language for Results
                                                        </label>
                                                        <select
                                                            value={selectedLanguage}
                                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                                            className="w-full px-4 py-2 border border-mycol-celadon rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                                        >
                                                            <option value="en">English</option>
                                                            <option value="mr">मराठी</option>
                                                            <option value="hi">हिंदी</option>
                                                            <option value="gu">ગુજરાતી</option>
                                                            <option value="de">German</option>
                                                            <option value="fr">Français</option>
                                                            <option value="es">Español</option>
                                                        </select>
                                                    </div>

                                                    {/* Submit Button */}

                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <ProcessingAnimation currentStep={processingStep} />
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="flex items-center p-4 bg-red-50 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                                            <p className="text-red-600">{error}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column - Image Preview */}
                                <div className="relative">
                                    {selectedImage ? (
                                        <div className="relative h-64 rounded-lg overflow-hidden">
                                            <img
                                                src={selectedImage}
                                                alt="Uploaded Crop"
                                                className="w-full h-full object-cover"
                                            />



                                            {isSubmitted && (
                                                <div className="absolute inset-0 bg-mycol-brunswick_green/50 backdrop-blur-sm flex items-center justify-center">
                                                    <div className="text-white text-center">
                                                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                                        <p>Processing...</p>
                                                    </div>

                                                </div>

                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-64 rounded-lg bg-mycol-nyanza/20 flex items-center justify-center">
                                            <p className="text-gray-800">Preview will appear here</p>
                                        </div>
                                    )}
                                    {/* Submit Button */}
                                    {selectedImage && <button
                                        onClick={handleSubmit}
                                        className="w-full py-3 mt-12 px-4 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <Sprout className="w-5 h-5" />
                                        <span>Analyze Image</span>
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Section */}
                    {prediction && !isSubmitted && (
                        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {prediction.disease}
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    {prediction.info.scientificName}
                                </p>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-gray-800">
                                        {prediction.info.detailedDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Causes Section */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        Causes
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        {prediction.info.causes.map((cause, index) => (
                                            <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                                {cause}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Spreading Conditions */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        Spreading Conditions
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        {prediction.info.spreadingConditions.map((condition, index) => (
                                            <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                                {condition}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Crop Info Section */}
                            <div className="mt-6 grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        Affected Crop
                                    </h4>
                                    <p className="mt-2 text-gray-600">
                                        {prediction.info.cropAffected}
                                    </p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        Scientific Name
                                    </h4>
                                    <p className="mt-2 text-gray-600">
                                        {prediction.info.scientificName}
                                    </p>
                                </div>
                            </div>

                            {/* Existing Symptoms and Prevention Sections */}


                            {/* Updated Treatment Section with Cultural Methods */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Treatment Options
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Chemical Treatments */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Chemical
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {prediction.info.treatment.chemical.map(
                                                (treatment, index) => (
                                                    <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                                        {treatment}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    {/* Cultural Practices */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Cultural
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {prediction.info.treatment.cultural.map((practice, index) => (
                                                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    {practice}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Organic Treatments */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            Organic
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                                            {prediction.info.treatment.organic.map((treatment, index) => (
                                                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    {treatment}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Prevention Section */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Prevention
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {prediction.info.prevention.map((measure, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gray-50 rounded-lg flex items-start"
                                        >
                                            <span className="text-green-600 mr-2">✓</span>
                                            <p className="text-gray-800">{measure}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommended Products Section */}
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Recommended Products
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {prediction.info.recommendedProducts.map((product, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gray-50 rounded-lg border border-green-200 flex items-center"
                                        >
                                            <ShoppingCart className="w-5 h-5 text-green-600 mr-3" />
                                            <p className="text-gray-800">{product}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DiseasesPanel />

            </div>

        </>
    );
};
export default DiseaseDetection;

