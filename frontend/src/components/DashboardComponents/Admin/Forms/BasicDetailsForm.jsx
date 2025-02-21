
const BasicDetailsForm = ({ basicDetails, setBasicDetails, errors }) => {
    const seasons = [
        { value: 'kharif', label: 'Kharif Season (July-October)' },
        { value: 'rabi', label: 'Rabi Season (October-March)' },
        { value: 'zaid', label: 'Zaid Season (March-June)' }
    ];

    const riskTypes = [
        { value: 'drought', label: 'Drought' },
        { value: 'flood', label: 'Flood' },
        { value: 'natural_calamities', label: 'Natural Calamities' }
    ];



    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Policy Name */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Policy Name
                    </label>
                    <input
                        type="text"
                        value={basicDetails.name}
                        onChange={(e) => setBasicDetails({
                            ...basicDetails,
                            name: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        placeholder="Enter policy name"
                    />
                    {errors?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Description */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={basicDetails.description}
                        onChange={(e) => setBasicDetails({
                            ...basicDetails,
                            description: e.target.value
                        })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        placeholder="Describe the insurance policy"
                    />
                </div>

                {/* Season Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Crop Season
                    </label>
                    <select
                        value={basicDetails.cropSeason}
                        onChange={(e) => setBasicDetails({
                            ...basicDetails,
                            cropSeason: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                    >
                        {seasons.map((season) => (
                            <option key={season.value} value={season.value}>
                                {season.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Season Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={basicDetails.seasonDates.startDate}
                            onChange={(e) => setBasicDetails({
                                ...basicDetails,
                                seasonDates: {
                                    ...basicDetails.seasonDates,
                                    startDate: e.target.value
                                }
                            })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={basicDetails.seasonDates.endDate}
                            onChange={(e) => setBasicDetails({
                                ...basicDetails,
                                seasonDates: {
                                    ...basicDetails.seasonDates,
                                    endDate: e.target.value
                                }
                            })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Financial Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Premium Amount (₹)
                    </label>
                    <input
                        type="number"
                        value={basicDetails.premium}
                        onChange={(e) => setBasicDetails({
                            ...basicDetails,
                            premium: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        placeholder="Enter premium amount"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sum Insured (₹)
                    </label>
                    <input
                        type="number"
                        value={basicDetails.sumInsured}
                        onChange={(e) => setBasicDetails({
                            ...basicDetails,
                            sumInsured: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        placeholder="Enter sum insured"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent Fee (₹)
                    </label>
                    <input
                        type="number"
                        value={basicDetails.agentFee}
                        onChange={(e) => setBasicDetails({
                            ...basicDetails,
                            agentFee: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                        placeholder="Enter agent fee"
                    />
                </div>

                {/* Risks */}
                <div className="col-span-1 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Covered Risks
                    </label>
                    <div className="space-y-2">
                        {riskTypes.map((risk) => (
                            <label key={risk.value} className="flex-col px-4 items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={basicDetails.risks.includes(risk.value)}
                                    onChange={(e) => {
                                        const newRisks = e.target.checked
                                            ? [...basicDetails.risks, risk.value]
                                            : basicDetails.risks.filter(r => r !== risk.value);
                                        setBasicDetails({
                                            ...basicDetails,
                                            risks: newRisks
                                        });
                                    }}
                                    className="rounded border-gray-300 text-mycol-mint focus:ring-mycol-mint"
                                />
                                <span className="text-gray-700">{risk.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicDetailsForm;