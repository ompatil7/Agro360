// Soil Analysis Component
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { Loader2, BarChart3 } from "lucide-react";
import axios from "axios";
import ProductCard from "../ProductCard";

const CropRecommendation = () => {
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        pH: "",
        rainfall: "",
    });
    const [prediction, setPrediction] = useState({});
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const resultsRef = useRef(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData({
            ...inputData,
            [name]: value,
        });
    };


    const proxyFetch = async (url) => {
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://cors-anywhere.herokuapp.com/'
        ];

        for (let proxy of proxies)
        {
            try
            {
                const proxyUrl = proxy + encodeURIComponent(url);
                const response = await axios.get(proxyUrl);
                return response.data;
            } catch (error)
            {
                console.error(`Failed with proxy ${proxy}:`, error);
                continue;
            }
        }
        throw new Error('All proxies failed');
    };

    // Update handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { N, P, K, temperature, humidity, pH, rainfall } = inputData;

        try
        {
            const response = await axios.get(
                "http://127.0.0.1:3000/api/v1/crops/infopredict",
                {
                    params: {
                        data: [N, P, K, temperature, humidity, pH, rainfall].map(
                            parseFloat
                        ),
                        lang: selectedLanguage,
                    },
                }
            );
            setPrediction(response.data);


            // Fetch related products
            if (response.data.crop)
            {
                const targetUrl = `https://cropify-v1.onrender.com/api/v1/crops/search?name=${response.data.crop}`;
                const data = await proxyFetch(targetUrl);
                setRelatedProducts(data.data.crop);
            }
        } catch (error)
        {
            console.error("Error:", error);
        } finally
        {
            setLoading(false);
            if (resultsRef.current)
            {
                resultsRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Crop Recommendation
                </h1>
                <p className="mt-2 text-gray-600">
                    Enter your soil parameters to get personalized crop recommendations
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Soil Parameters
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Enter accurate measurements for best results
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nitrogen (N)
                                </label>
                                <input
                                    type="number"
                                    name="N"
                                    value={inputData.N}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter N value"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phosphorus (P)
                                </label>
                                <input
                                    type="number"
                                    name="P"
                                    value={inputData.P}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter P value"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Potassium (K)
                                </label>
                                <input
                                    type="number"
                                    name="K"
                                    value={inputData.K}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter K value"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Temperature (°C)
                                </label>
                                <input
                                    type="number"
                                    name="temperature"
                                    value={inputData.temperature}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter temperature"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Humidity (%)
                                </label>
                                <input
                                    type="number"
                                    name="humidity"
                                    value={inputData.humidity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter humidity"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    pH Level
                                </label>
                                <input
                                    type="number"
                                    name="pH"
                                    value={inputData.pH}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter pH"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rainfall (mm)
                                </label>
                                <input
                                    type="number"
                                    name="rainfall"
                                    value={inputData.rainfall}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter rainfall"
                                    required
                                />
                            </div>

                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    "Recommend Crop"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center mb-4">
                            <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
                            <h3 className="font-semibold text-gray-800">Quick Tips</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>• Enter values in their respective units</li>
                            <li>• Ensure all measurements are recent</li>
                            <li>• pH should be between 0-14</li>
                            <li>• Temperature in Celsius</li>
                            <li>• Humidity in percentage</li>
                            <li>• Rainfall in millimeters</li>
                        </ul>
                    </div>
                </div>
            </div>

            {prediction.crop && (
                <div
                    ref={resultsRef}
                    className="space-y-6"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Analysis Results
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-green-600 mb-2">
                                    Recommended Crop:{" "}
                                    <span className="text-gray-800">{prediction.crop}</span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Related Products
                                </h2>
                                <p className="mt-1 text-gray-800">
                                    Products available for your recommended crop
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6"> {/* Changed from grid to vertical stack */}
                                    {relatedProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CropRecommendation;