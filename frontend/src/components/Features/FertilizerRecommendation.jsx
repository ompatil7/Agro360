import React, { useState, useRef } from "react";


import { Loader2, BarChart3, ChevronDown, ChevronUp, Thermometer, Droplets, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../ProductCard";

const CollapsibleTable = ({ title, icon, data, initialShowCount = 4 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayData = isExpanded ? data : data.slice(0, initialShowCount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    {icon}
                    <h3 className="font-semibold text-gray-800 ml-2">{title}</h3>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {title.split(" ")[0]}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayData.map(([type, value]) => (
                            <motion.tr
                                key={value}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                    {type}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {value}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length > initialShowCount && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center py-1"
                >
                    {isExpanded ? "Show Less" : `Show ${data.length - initialShowCount} More`}
                </button>
            )}
        </motion.div>
    );
};


const ParameterInput = ({ label, name, value, onChange, icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
    >
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <div className="relative">
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
                {icon}
            </div>
        </div>
    </motion.div>
);


const FertilizerRecommendation = () => {
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({
        temperature: "",
        humidity: "",
        moisture: "",
        soilType: "",
        cropType: "",
        nitrogen: "",
        potassium: "",
        phosphorus: "",
    });
    const [prediction, setPrediction] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const resultsRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "soilType" && (isNaN(value) || value < 0 || value > 4))
        {
            return;
        }

        if (name === "cropType" && (isNaN(value) || value < 0 || value > 10))
        {
            return;
        }

        setInputData({ ...inputData, [name]: value });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const {
            temperature,
            humidity,
            moisture,
            soilType,
            cropType,
            nitrogen,
            potassium,
            phosphorus,
        } = inputData;

        try
        {
            const response = await axios.get(
                "http://127.0.0.1:3000/api/v1/crops/predictfertilizer",
                {
                    params: {
                        data: [
                            temperature,
                            humidity,
                            moisture,
                            soilType,
                            cropType,
                            nitrogen,
                            potassium,
                            phosphorus,
                        ].map(parseFloat),
                    },
                }
            );
            setPrediction(response.data);

            // Fetch related products
            if (response.data.prediction)
            {
                const targetUrl = `https://cropify-v1.onrender.com/api/v1/crops/search?name=${response.data.prediction}`;
                const data = await proxyFetch(targetUrl);
                setRelatedProducts(data.data.crop);
            }
        } catch (error)
        {
            console.error("Prediction Error:", error);
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

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto p-6"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800">
                    Fertilizer Recommendation
                </h1>
                <p className="mt-2 text-gray-600">
                    Enter your field parameters to get personalized fertilizer recommendations
                </p>
            </motion.div>

            {prediction.prediction ? (
                <div ref={resultsRef} className="space-y-6">
                    {/* Results Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Analysis Results
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-green-600 mb-2">
                                    Recommended Fertilizer:{" "}
                                    <span className="text-gray-800">{prediction.prediction}</span>
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
                                    Products available for your recommended fertilizer
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {relatedProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Field Parameters
                            </h2>
                            <p className="mt-1 text-gray-600">
                                Enter accurate measurements for best results
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <ParameterInput
                                    label="Temperature"
                                    name="temperature"
                                    value={inputData.temperature}
                                    onChange={handleChange}
                                    icon={<Thermometer className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Humidity"
                                    name="humidity"
                                    value={inputData.humidity}
                                    onChange={handleChange}
                                    icon={<Droplets className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Moisture"
                                    name="moisture"
                                    value={inputData.moisture}
                                    onChange={handleChange}
                                    icon={<Droplets className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Soil Type (0-4)"
                                    name="soilType"
                                    value={inputData.soilType}
                                    onChange={handleChange}
                                    icon={<Sprout className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Crop Type (0-10)"
                                    name="cropType"
                                    value={inputData.cropType}
                                    onChange={handleChange}
                                    icon={<Sprout className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Nitrogen"
                                    name="nitrogen"
                                    value={inputData.nitrogen}
                                    onChange={handleChange}
                                    icon={<BarChart3 className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Potassium"
                                    name="potassium"
                                    value={inputData.potassium}
                                    onChange={handleChange}
                                    icon={<BarChart3 className="w-5 h-5" />}
                                />
                                <ParameterInput
                                    label="Phosphorus"
                                    name="phosphorus"
                                    value={inputData.phosphorus}
                                    onChange={handleChange}
                                    icon={<BarChart3 className="w-5 h-5" />}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    "Recommend Fertilizer"
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    <div className="lg:col-span-1 space-y-6">
                        <CollapsibleTable
                            title="Soil Type Guide"
                            icon={<Sprout className="w-6 h-6 text-green-600" />}
                            data={[
                                ["Black", "0"],
                                ["Clayey", "1"],
                                ["Loamy", "2"],
                                ["Red", "3"],
                                ["Sandy", "4"],
                            ]}
                        />

                        <CollapsibleTable
                            title="Crop Type Guide"
                            icon={<Droplets className="w-6 h-6 text-green-600" />}
                            data={[
                                ["Barley", "0"],
                                ["Cotton", "1"],
                                ["Ground Nut", "2"],
                                ["Maize", "3"],
                                ["Millets", "4"],
                                ["Oilseeds", "5"],
                                ["Paddy", "6"],
                                ["Pulses", "7"],
                                ["Sugarcane", "8"],
                                ["Tobacco", "9"],
                                ["Wheat", "10"],
                            ]}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );

};

export default FertilizerRecommendation;