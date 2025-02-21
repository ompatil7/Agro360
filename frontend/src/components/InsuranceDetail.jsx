// InsuranceDetail.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// If you're using any icon libraries, import them here, e.g., FontAwesome
import { FaArrowLeft, FaShieldAlt, FaMapMarkerAlt, FaFileInvoiceDollar, FaTemperatureHigh, FaSeedling, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';
const InsuranceDetail = () => {
  const { id } = useParams(); // Get ID from URL
  const [insurance, setInsurance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try
      {
        setIsLoading(true);
        const response = await axios.get(`/api/v1/insurance/${id}`, {
          withCredentials: true
        });

        setInsurance(response.data.data.policy);
      } catch (err)
      {
        console.error("Error fetching insurance:", err);
        setError(err.response?.data?.message || 'Failed to fetch insurance details');
      } finally
      {
        setIsLoading(false);
      }
    };

    fetchInsuranceDetails();
  }, [id]);



  if (isLoading)
  {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mycol-mint"></div>
      </div>
    );
  }

  if (error)
  {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Link to="/insurance" className="text-mycol-mint hover:text-mycol-mint-2 mt-4 inline-block">
            Back to Insurance Plans
          </Link>
        </div>
      </div>
    );
  }

  if (!insurance) return null;



  const handleApply = async () => {
    try
    {
      setIsLoading(true);
      const response = await axios.post(`/api/v1/assign/create/${id}`, {
        withCredentials: true
      });
      console.log("res api ", response)

      if (response.data.status === 'success')
      {
        setHasApplied(true);
        toast.success('Successfully applied for insurance policy!', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #059669',
          },
        });
      }
    } catch (err)
    {
      if (err.response?.data?.message?.includes('already applied'))
      {
        toast.error('You have already applied for this insurance policy', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#DC2626',
            border: '1px solid #DC2626',
          },
        });
        setHasApplied(true);
      } else
      {
        toast.error('Failed to apply for insurance policy. Please try again.', {
          duration: 4000,
          position: 'top-right',
        });
      }
    } finally
    {
      setIsLoading(false);
    }
  };

  {/* Apply Button Component */ }
  const ApplyButton = () => {
    if (isLoading)
    {
      return (
        <button
          disabled
          className="bg-mycol-mint/50 text-white px-12 py-4 rounded-lg shadow-lg transition duration-300 text-lg font-semibold flex items-center mx-auto"
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          Applying...
        </button>
      );
    }

    if (hasApplied)
    {
      return (
        <div className="flex flex-col items-center">
          <div className="bg-mycol-mint/10 text-mycol-mint px-6 py-3 rounded-lg flex items-center">
            <FaCheckCircle className="mr-2" />
            Already Applied
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Check your applications in dashboard
          </p>
        </div>
      );
    }

    return (
      <button
        onClick={handleApply}
        className="bg-mycol-mint hover:bg-mycol-mint-2 text-white px-12 py-4 rounded-lg shadow-lg transition duration-300 text-lg font-semibold flex items-center mx-auto"
      >
        <FaFileInvoiceDollar className="mr-2" /> Apply for This Policy
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mycol-nyanza via-white to-mycol-celadon-2 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/insurance"
          className="inline-flex items-center text-mycol-sea_green hover:text-mycol-mint transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Insurance Plans
        </Link>

        {/* Hero Section */}
        <div className="bg-mycol-brunswick_green rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
                  <FaSeedling className="text-mycol-mint" />
                  {insurance.name}
                </h1>
                <p className="text-mycol-celadon text-lg mb-6">
                  {insurance.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-mycol-celadon text-sm">Policy Number</div>
                    <div className="text-white font-semibold">{insurance.policyNumber}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-mycol-celadon text-sm">Premium Amount</div>
                    <div className="text-white font-semibold">₹{insurance.premium.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-mycol-celadon text-sm">Status</div>
                    <div className={`font-semibold ${insurance.status === 'active' ? 'text-mycol-mint' : 'text-red-400'
                      }`}>
                      {insurance.status}
                    </div>

                  </div>


                </div>
              </div>
              <div className="hidden md:block">
                <div className='flex-row gap-12'>
                  <div className="bg-white/10 rounded-full p-6">
                    <div className="bg-white/20 rounded-full p-5">
                      <div className="bg-mycol-mint rounded-full p-4">
                        <FaShieldAlt className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className='mt-6'>
                    <ApplyButton />
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Coverage Details */}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-mycol-brunswick_green mb-6 flex items-center gap-2">
                <div className="bg-mycol-nyanza p-2 rounded-lg">
                  <FaSeedling className="text-mycol-mint w-5 h-5" />
                </div>
                Coverage Details
              </h2>
              <div className="grid gap-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Crop Season</span>
                  <span className="font-medium text-mycol-sea_green capitalize">{insurance.cropSeason}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Season Duration</span>
                  <span className="font-medium text-mycol-sea_green">
                    {new Date(insurance.seasonDates.startDate).toLocaleDateString()} - {' '}
                    {new Date(insurance.seasonDates.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Sum Insured</span>
                  <span className="font-medium text-mycol-sea_green">
                    ₹{insurance.sumInsured.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Agent Fee</span>
                  <span className="font-medium text-mycol-sea_green">
                    ₹{insurance.agentFee.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Covered Crops */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Covered Crops</h3>
                <div className="space-y-3">
                  {insurance.cropDetails.map((category, index) => (
                    <div key={index} className="bg-mycol-nyanza/20 p-3 rounded-lg">
                      <div className="font-medium text-mycol-brunswick_green mb-2">{category.cropCategory}</div>
                      <div className="flex flex-wrap gap-2">
                        {category.crops.map((crop, cropIndex) => (
                          <span key={cropIndex} className="px-3 py-1 bg-white text-mycol-sea_green rounded-full text-sm">
                            {crop.cropType}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Risks Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {insurance.risks.map((risk, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-mycol-nyanza text-mycol-sea_green rounded-full text-sm capitalize"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            </div>


            {/* Eligibility Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-mycol-brunswick_green mb-6 flex items-center gap-2">
                <div className="bg-mycol-nyanza p-2 rounded-lg">
                  <FaFileInvoiceDollar className="text-mycol-mint w-5 h-5" />
                </div>
                Eligibility Requirements
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-mycol-nyanza/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Minimum Land Area</div>
                    <div className="text-lg font-medium text-mycol-sea_green">
                      {insurance.eligibility.minLandArea} acres
                    </div>
                  </div>
                  <div className="bg-mycol-nyanza/30 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Maximum Land Area</div>
                    <div className="text-lg font-medium text-mycol-sea_green">
                      {insurance.eligibility.maxLandArea} acres
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Required Documents</h3>
                  <div className="space-y-2">
                    {insurance.eligibility.requiredDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="bg-mycol-mint/20 p-2 rounded-full">
                          <svg className="w-4 h-4 text-mycol-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue with other sections... */}
          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Claim Criteria */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-mycol-brunswick_green mb-6 flex items-center gap-2">
                <div className="bg-mycol-nyanza p-2 rounded-lg">
                  <FaShieldAlt className="text-mycol-mint w-5 h-5" />
                </div>
                Claim Criteria
              </h2>
              <div className="space-y-4">
                {insurance.claimCriteria.map((criteria, index) => (
                  <div
                    key={index}
                    className="bg-mycol-nyanza/20 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-mycol-mint/20 p-2 rounded-full">
                        <FaShieldAlt className="w-4 h-4 text-mycol-mint" />
                      </div>
                      <h3 className="font-medium text-mycol-brunswick_green">
                        {criteria.damageType}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Minimum Damage</div>
                        <div className="font-medium text-mycol-sea_green">
                          {criteria.minimumDamagePercentage}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Compensation</div>
                        <div className="font-medium text-mycol-sea_green">
                          {criteria.compensationPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>





            {/* Thresholds */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-mycol-brunswick_green mb-6 flex items-center gap-2">
                <div className="bg-mycol-nyanza p-2 rounded-lg">
                  <FaTemperatureHigh className="text-mycol-mint w-5 h-5" />
                </div>
                Weather Thresholds for Crops
              </h2>
              <div className="space-y-4">
                {insurance.cropDetails.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium text-mycol-brunswick_green mb-3">{category.cropCategory}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.crops.map((crop, cropIndex) => (
                        <div key={cropIndex} className="bg-mycol-nyanza/30 p-4 rounded-lg">
                          <div className="font-medium text-mycol-sea_green mb-2">{crop.cropType}</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Temperature:</span>
                              <span>{crop.thresholds.temperature.minTemperature}°C - {crop.thresholds.temperature.maxTemperature}°C</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rainfall:</span>
                              <span>{crop.thresholds.rainfall.minRainfall}mm - {crop.thresholds.rainfall.maxRainfall}mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Humidity:</span>
                              <span>{crop.thresholds.humidity.minHumidity}% - {crop.thresholds.humidity.maxHumidity}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-mycol-brunswick_green mb-6 flex items-center gap-2">
                <div className="bg-mycol-nyanza p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-mycol-mint w-5 h-5" />
                </div>
                Covered Regions
              </h2>
              <div className="grid gap-4">
                {insurance.regions.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-mycol-nyanza/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-mycol-mint/20 p-2 rounded-full">
                        <FaMapMarkerAlt className="w-4 h-4 text-mycol-mint" />
                      </div>
                      <div>
                        <div className="font-medium text-mycol-brunswick_green">
                          {region.state}
                        </div>
                        <div className="text-sm text-gray-600">
                          {region.district}
                        </div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-mycol-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            {/* <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-mycol-brunswick_green mb-6 flex items-center gap-2">
                <div className="bg-mycol-nyanza p-2 rounded-lg">
                  <FaCalendarAlt className="text-mycol-mint w-5 h-5" />
                </div>
                Additional Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Created By</span>
                  <span className="font-medium text-mycol-sea_green">{insurance.createdBy}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Last Modified</span>
                  <span className="font-medium text-mycol-sea_green">
                    {new Date(insurance.lastModifiedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Application Process Section */}
          <div className="col-span-1 md:col-span-2 mt-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-mycol-brunswick_green text-center mb-8">
                Application Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <FaFileInvoiceDollar className="w-6 h-6" />,
                    title: "Apply to Policy",
                    description: "Apply to Insurance policy and wait till Agent Visit is done"
                  },
                  {
                    icon: <FaShieldAlt className="w-6 h-6" />,
                    title: "Verification (Agent Visit)",
                    description: "Our team will come to your land and fill in the details and collect the required documents"
                  },
                  {
                    icon: <FaCheckCircle className="w-6 h-6" />,
                    title: "Get Insured",
                    description: "Receive your policy document and pay the premium and start your coverage"
                  }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-mycol-nyanza/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="bg-mycol-mint/20 w-12 h-12 rounded-full flex items-center justify-center">
                        <div className="text-mycol-mint">
                          {step.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-mycol-brunswick_green mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-mycol-brunswick_green mb-4">
            Ready to Secure Your Crop?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get comprehensive coverage for your agricultural investments with our easy application process.
          </p>
          <ApplyButton />
        </div>
      </div>
    </div>
  );
};

export default InsuranceDetail;
