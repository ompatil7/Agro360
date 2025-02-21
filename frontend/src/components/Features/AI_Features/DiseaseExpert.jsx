import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DiseaseExpert = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const chatContainerRef = useRef(null);


    useEffect(() => {
        let loadingTexts = ['Thinking...', 'Analyzing...', 'Processing...', 'Understanding...'];
        let currentIndex = 0;

        if (loading)
        {
            const interval = setInterval(() => {
                setLoadingMessage(loadingTexts[currentIndex]);
                currentIndex = (currentIndex + 1) % loadingTexts.length;
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [loading]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current)
        {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
                className="w-48 h-48 mb-4 text-mycol-mint/50"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M12 12V8M12 16H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M9 9C9 9 10 8 12 8C14 8 15 9 15 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-center text-gray-500 max-w-sm">
                Start a conversation by asking any question about agriculture and farming!
            </p>
        </div>
    );

    const formatResponse = (response) => {
        // Handle both direct response and rawResponse cases
        const data = response.rawResponse ? JSON.parse(response.rawResponse) : response;
        return data;
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            type: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try
        {
            const response = await axios.post('/api/v1/ai/chat', {
                message: inputMessage
            });

            const formattedResponse = formatResponse(response.data);

            setMessages(prev => [...prev, {
                type: 'bot',
                content: formattedResponse,
                timestamp: new Date().toISOString()
            }]);
        } catch (error)
        {
            console.error('Error:', error);
            toast.error('Failed to get response from the AI');
        } finally
        {
            setLoading(false);
        }
    };

    const renderBotResponse = (content) => {
        const renderList = (items) => {
            if (!Array.isArray(items) || items.length === 0) return null;
            return (
                <ul className="list-disc list-inside space-y-1">
                    {items.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                    ))}
                </ul>
            );
        };

        const renderProductRecommendation = (product) => {
            return (
                <div className="bg-white/50 p-3 rounded-lg space-y-2">
                    <h4 className="font-medium text-mycol-brunswick_green">{product.productName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><span className="font-medium">Active Ingredient:</span> {product.activeIngredient}</p>
                        <p><span className="font-medium">Mode of Action:</span> {product.modeOfAction}</p>
                        <p><span className="font-medium">Application Rate:</span> {product.applicationRate}</p>
                        <p><span className="font-medium">Timing:</span> {product.applicationTiming}</p>
                    </div>
                    <div className="mt-2 text-sm">
                        <p><span className="font-medium">Safety:</span> {product.safetyInformation}</p>
                        <p><span className="font-medium">Compatibilities:</span> {product.compatibilities}</p>
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-6">
                {/* Disease Type and Overview */}
                <div className="bg-mycol-sea_green/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-mycol-brunswick_green text-xl mb-3">{content.type}</h3>
                    <p className="text-gray-700">{content.overview}</p>
                </div>

                {/* Scientific Classification */}
                <div className="bg-mycol-nyanza/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-mycol-brunswick_green mb-3">Scientific Classification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p><span className="font-medium">Scientific Name:</span> {content.scientificName}</p>
                        {Object.entries(content.pathogenClassification).map(([key, value]) => (
                            <p key={key}>
                                <span className="font-medium capitalize">{key}:</span> {value}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Symptoms and Diagnosis */}
                <div className="bg-mycol-mint/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-mycol-brunswick_green mb-3">Symptoms & Diagnosis</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-mycol-sea_green">Progression</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                <div className="p-3 bg-white/50 rounded">
                                    <p className="font-medium">Early Stage</p>
                                    <p className="text-sm">{content.symptoms.earlySymptoms}</p>
                                </div>
                                <div className="p-3 bg-white/50 rounded">
                                    <p className="font-medium">Progressive Stage</p>
                                    <p className="text-sm">{content.symptoms.progressiveSymptoms}</p>
                                </div>
                                <div className="p-3 bg-white/50 rounded">
                                    <p className="font-medium">Advanced Stage</p>
                                    <p className="text-sm">{content.symptoms.advancedSymptoms}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-mycol-sea_green">Diagnostic Techniques</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                {Object.entries(content.symptoms.diagnosticTechniques).map(([key, value]) => (
                                    <div key={key} className="p-3 bg-white/50 rounded">
                                        <p className="font-medium capitalize">{key}</p>
                                        <p className="text-sm">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prevention and Treatment */}
                <div className="bg-mycol-nyanza/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-mycol-brunswick_green mb-3">Prevention & Treatment</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-mycol-sea_green">Preventive Measures</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                <div>
                                    <p className="font-medium">Resistant Cultivars</p>
                                    {renderList(content.prevention.resistantCultivars)}
                                </div>
                                <div>
                                    <p className="font-medium">Cultural Practices</p>
                                    {renderList(content.prevention.culturalPractices)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-mycol-sea_green">Treatment Options</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                <div>
                                    <p className="font-medium">Chemical Control</p>
                                    {renderList(content.treatment.chemicalControl.protectantFungicides)}
                                </div>
                                <div>
                                    <p className="font-medium">Biological Control</p>
                                    {renderList(content.treatment.biologicalControl.antagonisticMicroorganisms)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Recommendations */}
                {content.productRecommendations && content.productRecommendations.length > 0 && (
                    <div className="bg-mycol-mint/10 p-4 rounded-lg">
                        <h3 className="font-semibold text-mycol-brunswick_green mb-3">Product Recommendations</h3>
                        <div className="space-y-3">
                            {content.productRecommendations.map((product, index) => (
                                <div key={index}>
                                    {renderProductRecommendation(product)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* References */}
                {content.references && content.references.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-mycol-brunswick_green mb-3">References</h3>
                        {renderList(content.references)}
                    </div>
                )}

                {/* Additional Information */}
                {content.additionalInformation && (
                    <div className="bg-mycol-nyanza/20 p-4 rounded-lg">
                        <h3 className="font-semibold text-mycol-brunswick_green mb-3">Additional Information</h3>
                        <p className="text-gray-700">{content.additionalInformation}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen bg-gradient-to-br from-mycol-nyanza/30 to-white p-6"
        >
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full relative"> {/* Added relative */}
                {/* Header */}
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-mycol-brunswick_green to-mycol-mint bg-clip-text text-transparent">
                        AI Agricultural Diseases Expert
                    </h1>
                    <p className="text-gray-600">Ask me anything about agricultural diseases!</p>
                </motion.div>

                {/* Chat Container */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-6 rounded-xl bg-white shadow-lg p-6 space-y-6"
                    style={{ maxHeight: 'calc(100vh - 340px)' }} // Add fixed maximum height
                >
                    {messages.length === 0 ? (
                        <EmptyState />
                    ) : <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.timestamp}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-7xl rounded-lg p-4 ${message.type === 'user'
                                        ? 'bg-mycol-mint text-white'
                                        : 'bg-gray-100'
                                        }`}
                                >
                                    {message.type === 'user' ? (
                                        <p>{message.content}</p>
                                    ) : (
                                        renderBotResponse(message.content)
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>}


                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-start"
                        >
                            <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
                                <Loader2 className="w-6 h-6 animate-spin text-mycol-sea_green" />
                                <span className="text-gray-600">{loadingMessage}</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Form */}
                <motion.form
                    onSubmit={handleSend}
                    className="flex space-x-4  bg-transparent backdrop-blur-sm py-2"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                >
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask your question here..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mycol-mint focus:border-transparent outline-none bg-white"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-mycol-mint to-mycol-sea_green text-white rounded-xl flex items-center space-x-2 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                    </motion.button>
                </motion.form>
            </div>
        </motion.div >
    );
};

export default DiseaseExpert;