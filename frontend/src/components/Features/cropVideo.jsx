// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import {
//   Upload,
//   Leaf,
//   FlaskConical,
//   Sprout,
//   ShieldAlert,
//   CircleAlert,
//   Loader2,
// } from "lucide-react";

// const VideoAnalysisPage = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileSelect = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!file) return;

//     setLoading(true);
//     setError("");
//     const formData = new FormData();
//     formData.append("video", file);

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:5000/detect_crop_disease_video",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) throw new Error("Analysis failed");

//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       setError("Failed to analyze video. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const primaryDisease = result?.predictions?.[0];

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold text-center mb-8 text-emerald-800">
//         CropGuard AI
//         <Leaf className="inline-block ml-2 w-8 h-8 text-emerald-600" />
//       </h1>

//       {/* File Upload Section */}
//       <div className="mb-8 space-y-6">
//         <label className="block">
//           <input
//             type="file"
//             accept="video/*"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//           <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-emerald-400 transition-colors">
//             <Upload className="w-12 h-12 text-gray-500 mb-4" />
//             <p className="text-gray-600 text-lg">Click to upload video</p>
//             <p className="text-sm text-gray-500 mt-2">
//               Supported formats: MP4, MOV, AVI
//             </p>
//           </div>
//         </label>

//         {preview && (
//           <div className="mt-6">
//             <video
//               controls
//               src={preview}
//               className="w-full rounded-lg shadow-lg border border-gray-200"
//             />
//           </div>
//         )}
//       </div>

//       {/* Analyze Button */}
//       {file && (
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className={`w-full py-3 rounded-lg font-semibold text-lg transition-transform
//             ${
//               loading
//                 ? "bg-emerald-400 cursor-not-allowed"
//                 : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02]"
//             }
//             text-white flex items-center justify-center gap-2`}
//         >
//           {loading ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin" />
//               Analyzing...
//             </>
//           ) : (
//             "Detect Diseases"
//           )}
//         </button>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-700">
//           <CircleAlert className="w-6 h-6 mt-1" />
//           <div>
//             <h3 className="font-semibold">Analysis Error</h3>
//             <p>{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Results Display */}
//       {primaryDisease && (
//         <div className="mt-8 space-y-6">
//           <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//             <div className="flex items-start gap-4 mb-6">
//               <div className="bg-emerald-100 p-3 rounded-lg">
//                 <ShieldAlert className="w-8 h-8 text-emerald-600" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   {primaryDisease.disease}
//                 </h2>
//                 <p className="text-emerald-600 font-medium mt-1">
//                   {(primaryDisease.confidence * 100).toFixed(1)}% Confidence
//                 </p>
//               </div>
//             </div>

//             {primaryDisease.info ? (
//               <>
//                 {/* Symptoms */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-emerald-800">
//                     <FlaskConical className="w-5 h-5" />
//                     Key Symptoms
//                   </h3>
//                   <ul className="list-disc pl-6 space-y-2 text-gray-700">
//                     {primaryDisease.info.symptoms?.map((symptom, i) => (
//                       <li key={i}>{symptom}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Treatment Grid */}
//                 <div className="grid md:grid-cols-3 gap-6">
//                   {/* Chemical Treatment */}
//                   <div className="bg-red-50 p-5 rounded-xl">
//                     <h3 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
//                       <FlaskConical className="w-5 h-5" />
//                       Chemical Treatment
//                     </h3>
//                     <ul className="space-y-2">
//                       {primaryDisease.info.treatment.chemical?.map((t, i) => (
//                         <li key={i} className="text-red-700/90">
//                           {t}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Organic Treatment */}
//                   <div className="bg-green-50 p-5 rounded-xl">
//                     <h3 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
//                       <Sprout className="w-5 h-5" />
//                       Organic Solutions
//                     </h3>
//                     <ul className="space-y-2">
//                       {primaryDisease.info.treatment.organic?.map((t, i) => (
//                         <li key={i} className="text-green-700/90">
//                           {t}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Prevention */}
//                   <div className="bg-blue-50 p-5 rounded-xl">
//                     <h3 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
//                       <ShieldAlert className="w-5 h-5" />
//                       Prevention
//                     </h3>
//                     <ul className="space-y-2">
//                       {primaryDisease.info.prevention?.map((p, i) => (
//                         <li key={i} className="text-blue-700/90">
//                           {p}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700 flex gap-3">
//                 <CircleAlert className="w-5 h-5 mt-1" />
//                 <p>No detailed information available for this disease</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoAnalysisPage;
import { useState, useRef } from "react";
import {
  UploadCloud,
  Leaf,
  TestTube,
  Sprout,
  Shield,
  AlertCircle,
  Loader2,
  Play,
} from "lucide-react";

const VideoAnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const primaryDisease = result?.predictions?.[0];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/detect_crop_disease_video",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to analyze video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-teal-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-emerald-900 mb-4 flex items-center justify-center gap-3">
            <Leaf className="w-12 h-12 text-emerald-600" />
            CropGuard AI
          </h1>
          <p className="text-xl text-emerald-700/90">
            Advanced AI-Powered Crop Disease Detection System
          </p>
        </div>

        {/* Main Content Grid */}
        <div
          className={`grid ${
            primaryDisease ? "lg:grid-cols-2" : ""
          } gap-8 items-start`}
        >
          {/* Left Column - Upload Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-100 p-6">
            <label className="block cursor-pointer space-y-6">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-4 py-8 rounded-xl border-2 border-dashed border-emerald-200 hover:border-emerald-300 transition-colors">
                <UploadCloud className="w-16 h-16 text-emerald-500/80 mb-4" />
                <p className="text-lg font-medium text-emerald-800">
                  {file ? "Video Selected" : "Upload Plant Video"}
                </p>
                <p className="text-sm text-emerald-600/70">
                  {file ? file.name : "MP4, MOV, or AVI • Max 5 minutes"}
                </p>
              </div>

              {preview && (
                <div className="relative group mt-6">
                  <video
                    ref={videoRef}
                    src={preview}
                    className="w-full rounded-xl shadow-lg border-2 border-emerald-100 aspect-video bg-gray-900/5"
                  />
                  <button
                    onClick={() => videoRef.current?.play()}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-emerald-600" />
                    </div>
                  </button>
                </div>
              )}

              {file && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold text-lg transition-all
                    ${
                      loading
                        ? "bg-emerald-300 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
                    }
                    text-white flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Detect Diseases"
                  )}
                </button>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50/90 rounded-xl border border-red-100 flex gap-3 items-start text-red-800">
                  <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Analysis Error</h3>
                    <p className="text-red-700/90">{error}</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Right Column - Results */}
          {primaryDisease && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-emerald-100 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-emerald-600/10 p-3 rounded-xl">
                  <Shield className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900">
                    {primaryDisease.disease}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      {(primaryDisease.confidence * 100).toFixed(1)}% Confidence
                    </span>
                    <span className="text-emerald-700/80 text-sm">
                      • Detected {primaryDisease.count} times
                    </span>
                  </div>
                </div>
              </div>

              {primaryDisease.info?.symptoms && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-800">
                    <TestTube className="w-5 h-5" />
                    Key Symptoms
                  </h3>
                  <div className="grid gap-3">
                    {primaryDisease.info.symptoms.map((symptom, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                        <span className="text-emerald-800/90">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Treatment Section - Below Both Columns */}
        {primaryDisease?.info && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {/* Chemical Treatment */}
            <div className="bg-red-50/90 p-6 rounded-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600/10 p-2 rounded-lg">
                  <TestTube className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900">
                  Chemical Solutions
                </h3>
              </div>
              <ul className="space-y-2">
                {primaryDisease.info.treatment.chemical.map((t, i) => (
                  <li
                    key={i}
                    className="text-red-800/90 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic Treatment */}
            <div className="bg-green-50/90 p-6 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600/10 p-2 rounded-lg">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">
                  Organic Solutions
                </h3>
              </div>
              <ul className="space-y-2">
                {primaryDisease.info.treatment.organic.map((t, i) => (
                  <li
                    key={i}
                    className="text-green-800/90 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div className="bg-blue-50/90 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600/10 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Prevention
                </h3>
              </div>
              <ul className="space-y-2">
                {primaryDisease.info.prevention.map((p, i) => (
                  <li
                    key={i}
                    className="text-blue-800/90 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysisPage;
