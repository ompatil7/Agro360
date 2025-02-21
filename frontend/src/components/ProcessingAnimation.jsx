import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

const ProcessingAnimation = ({ currentStep }) => {

    const [processingStep, setProcessingStep] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Add this array for processing steps
    const processingSteps = [
        { id: 1, text: "Uploading image...", delay: 1000 },
        { id: 2, text: "Processing image...", delay: 2000 },
        { id: 3, text: "Analyzing image...", delay: 2000 },
        { id: 4, text: "Translating results...", delay: 1500 }
    ];
    return (
        <div className="h-64 flex items-center justify-center">
            <div className="space-y-6 w-full max-w-md">
                {processingSteps.map((step) => (
                    <div
                        key={step.id}
                        className={`transition-all duration-500 ${step.id === currentStep
                            ? "opacity-100 transform scale-100"
                            : step.id < currentStep
                                ? "opacity-50 transform scale-95"
                                : "opacity-30 transform scale-95"
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id === currentStep
                                ? "bg-mycol-mint"
                                : step.id < currentStep
                                    ? "bg-gray-200"
                                    : "bg-gray-100"
                                }`}>
                                {step.id < currentStep ? (
                                    <Check className="w-5 h-5 text-white" />
                                ) : step.id === currentStep ? (
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                )}
                            </div>
                            <span className={`text-lg ${step.id === currentStep
                                ? "text-mycol-brunswick_green font-medium"
                                : "text-gray-500"
                                }`}>
                                {step.text}
                            </span>
                        </div>
                        {step.id !== processingSteps.length && (
                            <div className="ml-4 mt-2 h-8 border-l-2 border-gray-200" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProcessingAnimation;