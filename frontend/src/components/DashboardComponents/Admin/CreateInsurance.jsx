import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
// import { motion } from 'framer-motion';
import {
    Shield,
    Calendar,
    FileText,
    MapPin,
    ChevronRight,
} from 'lucide-react';
// import BasicDetailsForm from '  ./Forms/BasicDetailsForm';
import BasicDetailsForm from './Forms/BasicDetailsForm';
import CropDetailsForm from './Forms/CropDetailsForm';
import CoverageClaimsForm from './Forms/CoverageClaimsForm';
import RegionsForm from './Forms/RegionsForm';

import { useNavigate } from 'react-router-dom';

const CreateInsurance = () => {
    const { user } = useContext(AuthContext);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    // Add a new state for success message
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()

    // Basic Details
    const [basicDetails, setBasicDetails] = useState({
        name: '',
        description: '',
        cropSeason: 'kharif',
        seasonDates: {
            startDate: '',
            endDate: ''
        },
        premium: '',
        sumInsured: '',
        agentFee: '',
        risks: []
    });

    // Crop Details
    const [cropDetails, setCropDetails] = useState([{
        cropCategory: '',
        crops: [{
            cropType: '',
        }]
    }]);

    // Eligibility
    const [eligibility, setEligibility] = useState({
        minLandArea: '',
        maxLandArea: '',
        requiredDocuments: ['']
    });

    // Claim Criteria
    const [claimCriteria, setClaimCriteria] = useState([{
        damageType: 'crop_loss',
        minimumDamagePercentage: '',
        compensationPercentage: ''
    }]);

    // Regions
    const [regions, setRegions] = useState([{
        state: '',
        district: ''
    }]);

    const validateStep = (step) => {
        switch (step)
        {
            case 1:
                return (
                    basicDetails.name &&
                    basicDetails.description &&
                    basicDetails.seasonDates.startDate &&
                    basicDetails.seasonDates.endDate &&
                    basicDetails.premium &&
                    basicDetails.sumInsured &&
                    basicDetails.agentFee &&
                    basicDetails.risks.length > 0
                );
            case 2:
                return cropDetails.every(category =>
                    category.cropCategory &&
                    category.crops.length > 0
                );
            case 3:
                return (
                    eligibility.minLandArea &&
                    eligibility.maxLandArea &&
                    eligibility.requiredDocuments.length > 0 &&
                    claimCriteria.every(criteria =>
                        criteria.minimumDamagePercentage &&
                        criteria.compensationPercentage
                    )
                );
            case 4:
                return regions.every(region =>
                    region.state &&
                    region.district
                );
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep))
        {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        setError('');

        try
        {
            const formData = {
                ...basicDetails,
                cropDetails,
                eligibility,
                claimCriteria,
                regions
            };
            console.log("ccreate policy data ", formData)

            const response = await axios.post('/api/v1/insurance', formData, {
                withCredentials: true
            });

            if (response.data.status === 'success')
            {
                setSuccessMessage('Insurance policy created successfully!');
                // Wait for 2 seconds before redirecting
                setTimeout(() => {
                    navigate('/insurance');
                }, 2000);
            }
        } catch (err)
        {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally
        {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep)
        {
            case 1:
                return <BasicDetailsForm
                    basicDetails={basicDetails}
                    setBasicDetails={setBasicDetails}
                />;
            case 2:
                return <CropDetailsForm
                    cropDetails={cropDetails}
                    setCropDetails={setCropDetails}
                />;
            case 3:
                return <CoverageClaimsForm
                    eligibility={eligibility}
                    setEligibility={setEligibility}
                    claimCriteria={claimCriteria}
                    setClaimCriteria={setClaimCriteria}
                />;
            case 4:
                return <RegionsForm
                    regions={regions}
                    setRegions={setRegions}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Insurance Policy</h1>
                    <p className="mt-2 text-gray-600">Create a new crop insurance policy with comprehensive coverage</p>
                </div>

                {/*     Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {[
                            { step: 1, title: 'Basic Details', icon: FileText },
                            { step: 2, title: 'Crop Details', icon: Shield },
                            { step: 3, title: 'Coverage & Claims', icon: Calendar },
                            { step: 4, title: 'Regions', icon: MapPin }
                        ].map((item, index) => (
                            <div key={item.step} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= item.step
                                        ? 'bg-mycol-mint text-white'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={`ml-2 text-sm font-medium ${currentStep >= item.step
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                                    }`}>
                                    {item.title}
                                </span>
                                {index < 3 && (
                                    <ChevronRight className="w-5 h-5 mx-4 text-gray-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {renderStepContent()}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <div className="flex justify-between pt-6">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                        )}

                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="ml-auto px-6 py-2 bg-mycol-mint text-white rounded-lg hover:bg-mycol-mint-2"
                                disabled={isSubmitting}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`ml-auto px-6 py-2 bg-mycol-mint text-white rounded-lg transition-all duration-200 
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-mycol-mint-2'}`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Creating Policy...</span>
                                    </div>
                                ) : (
                                    'Create Policy'
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateInsurance;