const CoverageClaimsForm = ({ eligibility, setEligibility, claimCriteria, setClaimCriteria, errors }) => {
    const damageTypes = [
        { value: 'crop_loss', label: 'Crop Loss' },
        { value: 'yield_reduction', label: 'Yield Reduction' },
        { value: 'quality_damage', label: 'Quality Damage' }
    ];

    const commonDocuments = [
        'Land Ownership Document',
        'Identity Proof',
        'Bank Account Details',
        'Previous Crop Records',
        'Soil Health Card',
        'Water Source Proof',
        'Land Survey Number Document',
        'Revenue Records'
    ];

    const addClaimCriteria = () => {
        setClaimCriteria([
            ...claimCriteria,
            {
                damageType: 'crop_loss',
                minimumDamagePercentage: '',
                compensationPercentage: ''
            }
        ]);
    };

    const removeClaimCriteria = (index) => {
        setClaimCriteria(claimCriteria.filter((_, i) => i !== index));
    };

    const addDocument = () => {
        setEligibility({
            ...eligibility,
            requiredDocuments: [...eligibility.requiredDocuments, '']
        });
    };

    const removeDocument = (index) => {
        setEligibility({
            ...eligibility,
            requiredDocuments: eligibility.requiredDocuments.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Eligibility Criteria</h3>

                <div className="space-y-6">
                    {/* Land Area Requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Minimum Land Area (Acres)
                            </label>
                            <input
                                type="number"
                                value={eligibility.minLandArea}
                                onChange={(e) => setEligibility({
                                    ...eligibility,
                                    minLandArea: e.target.value
                                })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                placeholder="Enter minimum acres"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Land Area (Acres)
                            </label>
                            <input
                                type="number"
                                value={eligibility.maxLandArea}
                                onChange={(e) => setEligibility({
                                    ...eligibility,
                                    maxLandArea: e.target.value
                                })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                placeholder="Enter maximum acres"
                            />
                        </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Required Documents
                        </label>
                        <div className="space-y-3">
                            {eligibility.requiredDocuments.map((doc, index) => (
                                <div key={index} className="flex gap-4">
                                    <select
                                        value={doc}
                                        onChange={(e) => {
                                            const newDocs = [...eligibility.requiredDocuments];
                                            newDocs[index] = e.target.value;
                                            setEligibility({
                                                ...eligibility,
                                                requiredDocuments: newDocs
                                            });
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                    >
                                        <option value="">Select required document</option>
                                        {commonDocuments.map((document) => (
                                            <option key={document} value={document}>
                                                {document}
                                            </option>
                                        ))}
                                    </select>
                                    {eligibility.requiredDocuments.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDocument}
                                className="text-mycol-mint hover:text-mycol-mint-2 font-medium"
                            >
                                + Add Document Requirement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Claim Criteria */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Claim Criteria</h3>

                <div className="space-y-6">
                    {claimCriteria.map((criteria, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-medium text-gray-700">
                                    Criteria {index + 1}
                                </h4>
                                {claimCriteria.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeClaimCriteria(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Damage Type
                                    </label>
                                    <select
                                        value={criteria.damageType}
                                        onChange={(e) => {
                                            const newCriteria = [...claimCriteria];
                                            newCriteria[index].damageType = e.target.value;
                                            setClaimCriteria(newCriteria);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                    >
                                        {damageTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Damage (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={criteria.minimumDamagePercentage}
                                        onChange={(e) => {
                                            const newCriteria = [...claimCriteria];
                                            newCriteria[index].minimumDamagePercentage = e.target.value;
                                            setClaimCriteria(newCriteria);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                        placeholder="Enter percentage"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Compensation (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={criteria.compensationPercentage}
                                        onChange={(e) => {
                                            const newCriteria = [...claimCriteria];
                                            newCriteria[index].compensationPercentage = e.target.value;
                                            setClaimCriteria(newCriteria);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                        placeholder="Enter percentage"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addClaimCriteria}
                        className="text-mycol-mint hover:text-mycol-mint-2 font-medium"
                    >
                        + Add Claim Criteria
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoverageClaimsForm;