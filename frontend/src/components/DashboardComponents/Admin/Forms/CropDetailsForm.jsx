const CropDetailsForm = ({ cropDetails, setCropDetails, errors }) => {
    const cropCategories = {
        Cereals: ["Wheat", "Rice", "Maize", "Barley", "Sorghum"],
        Pulses: ["Chickpea", "Lentil", "Pea", "PigeonPea"],
        Oilseeds: ["Mustard", "Sunflower", "Groundnut", "Soybean"],
        Vegetables: ["Tomato", "Potato", "Onion", "Cabbage", "Carrot"],
        Fruits: ["Mango", "Banana", "Apple", "Citrus", "Grapes"],
        FiberCrops: ["Cotton", "Jute"],
        SpicesAndPlantationCrops: ["Tea", "Coffee", "Pepper", "Cardamom"]
    };

    const addCropCategory = () => {
        setCropDetails([
            ...cropDetails,
            {
                cropCategory: '',
                crops: []
            }
        ]);
    };

    const removeCropCategory = (index) => {
        setCropDetails(cropDetails.filter((_, i) => i !== index));
    };

    const handleCropSelection = (categoryIndex, cropType, isSelected) => {
        const newCropDetails = [...cropDetails];
        if (isSelected)
        {
            newCropDetails[categoryIndex].crops.push({ cropType });
        } else
        {
            newCropDetails[categoryIndex].crops = newCropDetails[categoryIndex].crops.filter(
                crop => crop.cropType !== cropType
            );
        }
        setCropDetails(newCropDetails);
    };

    return (
        <div className="space-y-6">
            {cropDetails.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Crop Category {categoryIndex + 1}
                        </h3>
                        {cropDetails.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeCropCategory(categoryIndex)}
                                className="text-red-600 hover:text-red-700"
                            >
                                Remove Category
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Category
                            </label>
                            <select
                                value={category.cropCategory}
                                onChange={(e) => {
                                    const newCropDetails = [...cropDetails];
                                    newCropDetails[categoryIndex].cropCategory = e.target.value;
                                    newCropDetails[categoryIndex].crops = [];
                                    setCropDetails(newCropDetails);
                                }}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
                            >
                                <option value="">Select a category</option>
                                {Object.keys(cropCategories).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Crops Selection */}
                        {category.cropCategory && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Crops
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {cropCategories[category.cropCategory]?.map((cropType) => (
                                        <label
                                            key={cropType}
                                            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={category.crops.some(crop => crop.cropType === cropType)}
                                                onChange={(e) => handleCropSelection(categoryIndex, cropType, e.target.checked)}
                                                className="rounded border-gray-300 text-mycol-mint focus:ring-mycol-mint h-4 w-4"
                                            />
                                            <span className="text-gray-700">{cropType}</span>
                                        </label>
                                    ))}
                                </div>
                                {category.crops.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Please select at least one crop
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Selected Crops Summary */}
                    {category.crops.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Selected Crops
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {category.crops.map((crop, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-mycol-nyanza text-mycol-brunswick_green"
                                    >
                                        {crop.cropType}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addCropCategory}
                className="w-full py-3 border-2 border-dashed border-mycol-celadon text-mycol-sea_green rounded-lg hover:bg-mycol-nyanza/50 transition-colors"
            >
                + Add Another Category
            </button>
        </div>
    );
};

export default CropDetailsForm;