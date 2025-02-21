import { Leaf } from "lucide-react";

const DiseasesPanel = () => (
    // want it to be hidden on smaller screens
    <div className=" absolute right-6 top-24 w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-mycol-brunswick_green text-white">
            <h3 className="font-semibold flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Detectable Diseases
            </h3>
            <p className="text-sm text-mycol-celadon mt-1">Our AI can detect these crop diseases</p>
        </div>
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-4">
                {[
                    {
                        name: "Tomato", diseases: [
                            { name: "Septoria leaf spot", count: 20 },
                            { name: "Late blight", count: 12 },
                            { name: "Early blight leaf", count: 4 },
                            { name: "Mosaic virus", count: 12 },
                            { name: "Bacterial spot", count: 8 },
                            { name: "Bacterial spots", count: 6 },
                            { name: "Mold leaf", count: 3 },
                            { name: "Regular leaf", count: 4 },
                            { name: "Multiple leafs", count: 28 },
                        ]
                    },
                    {
                        name: "Grape", diseases: [
                            { name: "Black rot", count: 10 },
                            { name: "Regular leaf", count: 5 },
                        ]
                    },

                    {
                        name: "Corn", diseases: [
                            { name: "Blight leaf", count: 10 },
                            { name: "Gray leaf spot", count: 5 },
                        ]
                    },
                    {
                        name: "Potato", diseases: [
                            { name: "Late Blight", count: 8 },
                            { name: "Regular leaf", count: 6 },
                        ]
                    },
                    {
                        name: "Apple", diseases: [
                            { name: "Apple rust leaf", count: 8 },
                            { name: "Regular leaf", count: 10 },
                            { name: "Apple scab leaf", count: 12 },
                        ]
                    },
                    {
                        name: "Bell pepper", diseases: [
                            { name: "Regular leaf", count: 6 },
                            { name: "Bell pepper leaf spot", count: 8 },
                        ]
                    },
                    {
                        name: "Squash Powdery", diseases: [
                            { name: "Powdery mildew leaf", count: 9 },
                            { name: "Regular leaf", count: 10 },
                        ]
                    },
                    {
                        name: "Raspberry", diseases: [
                            { name: "Regular leaf", count: 10 },
                            { name: "Raspberry leaf", count: 10 },
                        ]
                    },
                    {
                        name: "Strawberry", diseases: [
                            { name: "Regular leaf", count: 10 },
                            { name: "Strawberry leaf", count: 10 },
                        ]
                    },
                    {
                        name: "Blueberry", diseases: [
                            { name: "Regular leaf", count: 10 },
                            { name: "Blueberry leaf", count: 10 },
                        ]
                    },
                    {
                        name: "Peach", diseases: [
                            { name: "Regular leaf", count: 10 },
                            { name: "Peach leaf", count: 10 },
                        ]
                    },
                    {
                        name: "Soyabean", diseases: [
                            { name: "Regular leaf", count: 10 },
                            { name: "Soyabean leaf", count: 10 },
                        ]
                    },
                    {
                        name: "Cherry", diseases: [
                            { name: "Regular leaf", count: 10 },
                            { name: "Cherry leaf", count: 10 },
                        ]
                    },
                ].map((crop, index) => (
                    <div key={index} className="space-y-2">
                        <h4 className="font-medium text-mycol-brunswick_green flex items-center gap-2">
                            <div className="w-2 h-2 bg-mycol-mint rounded-full"></div>
                            {crop.name}
                        </h4>
                        <div className="ml-4 space-y-1">
                            {crop.diseases.map((disease, dIndex) => (
                                <div key={dIndex} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">{disease.name}</span>
                                    <span className="text-mycol-sea_green bg-mycol-nyanza/50 px-2 py-0.5 rounded-full text-xs">
                                        {disease.count} samples
                                    </span>
                                </div>
                            ))}
                        </div>
                        <hr className="my-2  " />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default DiseasesPanel;