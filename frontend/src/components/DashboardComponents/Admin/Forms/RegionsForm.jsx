// RegionsForm.jsx
const RegionsForm = ({ regions, setRegions }) => {
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const addRegion = () => {
        setRegions([...regions, { state: '', district: '' }]);
    };

    const removeRegion = (index) => {
        setRegions(regions.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Coverage Regions</h3>
                <button
                    type="button"
                    onClick={addRegion}
                    className="text-mycol-mint hover:text-mycol-mint-2 font-medium"
                >
                    + Add Region
                </button>
            </div>

            <div className="space-y-4">
                {regions.map((region, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium text-gray-700">
                                Region {index + 1}
                            </h4>
                            {regions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRegion(index)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    value={region.state}
                                    onChange={(e) => {
                                        const newRegions = [...regions];
                                        newRegions[index].state = e.target.value;
                                        setRegions(newRegions);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                >
                                    <option value="">Select state</option>
                                    {indianStates.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    District
                                </label>
                                <input
                                    type="text"
                                    value={region.district}
                                    onChange={(e) => {
                                        const newRegions = [...regions];
                                        newRegions[index].district = e.target.value;
                                        setRegions(newRegions);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                                    placeholder="Enter district name"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegionsForm;