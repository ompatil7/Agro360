// import React, { useContext, useState, useRef } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Shield,
//   Calendar,
//   Edit2,
//   Check,
//   Home,
//   Building2,
//   MapPinned,
//   Camera,
//   X,
//   Loader2,
//   FileText,
//   Download,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import toast from "react-hot-toast";

// const UserProfile = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedUser, setEditedUser] = useState({
//     ...user,
//     address: user.address || {},
//   });
//   const [loading, setLoading] = useState(false);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedUser(user);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedUser(user);
//     setPhotoPreview(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("address.")) {
//       const addressField = name.split(".")[1];
//       setEditedUser((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [addressField]: value,
//         },
//       }));
//     } else {
//       setEditedUser((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const validateForm = () => {
//     if (!editedUser.name || !editedUser.email) {
//       toast.error("Name and email are required");
//       return false;
//     }
//     if (editedUser.email && !/\S+@\S+\.\S+/.test(editedUser.email)) {
//       toast.error("Please enter a valid email address");
//       return false;
//     }
//     return true;
//   };

//   const handlePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please upload an image file");
//       return;
//     }

//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       toast.error("Image size should be less than 5MB");
//       return;
//     }

//     try {
//       setLoading(true);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result);
//       };
//       reader.readAsDataURL(file);

//       const formData = new FormData();
//       formData.append("photo", file);

//       const response = await axios.patch("/api/v1/users/updateme", formData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setUser(response.data.data.user);
//       toast.success("Profile photo updated successfully");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update photo");
//       setPhotoPreview(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const response = await axios.patch(
//         "/api/v1/users/updateme",
//         {
//           name: editedUser.name,
//           email: editedUser.email,
//           phone: editedUser.phone,
//           address: editedUser.address,
//         },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.data.user) {
//         setUser(response.data.data.user);
//         setIsEditing(false);
//         toast.success("Profile updated successfully");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(error.response?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="flex-1 p-8 bg-gradient-to-br from-mycol-nyanza/30 to-white min-h-screen"
//     >
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg">
//             <Loader2 className="h-8 w-8 animate-spin text-mycol-sea_green" />
//           </div>
//         </div>
//       )}

//       {/* Header Section */}
//       <motion.div
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//         className="flex justify-between items-center mb-8"
//       >
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-mycol-brunswick_green to-mycol-mint bg-clip-text text-transparent mb-2">
//             Profile Details
//           </h1>
//           <p className="text-gray-600">
//             Manage your account information and settings
//           </p>
//         </div>
//         <div className="flex space-x-4">
//           {isEditing && (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleCancel}
//               className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <X className="h-5 w-5" />
//               <span>Cancel</span>
//             </motion.button>
//           )}
//           {!isEditing ? (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleEdit}
//               className="flex items-center space-x-2 bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <Edit2 className="h-5 w-5" />
//               <span>Edit Profile</span>
//             </motion.button>
//           ) : (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleSave}
//               disabled={loading}
//               className="flex items-center space-x-2 bg-gradient-to-r from-mycol-sea_green to-mycol-dartmouth_green text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
//             >
//               {loading ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <Check className="h-5 w-5" />
//               )}
//               <span>Save Changes</span>
//             </motion.button>
//           )}
//         </div>
//       </motion.div>

//       <div className="grid grid-cols-3 gap-8">
//         {/* Main Profile Info */}
//         <div className="col-span-2 space-y-6">
//           {/* Basic Info Card */}
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
//           >
//             <div className="flex items-start space-x-6">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-mycol-celadon shadow-md transition-transform group-hover:scale-105">
//                   <img
//                     src={
//                       photoPreview ||
//                       (user.photo !== "default.jpg"
//                         ? user.photo
//                         : "https://via.placeholder.com/100")
//                     }
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 {isEditing && (
//                   <>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handlePhotoChange}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => fileInputRef.current?.click()}
//                       className="absolute bottom-0 right-0 p-2 bg-mycol-mint text-white rounded-full shadow-lg hover:bg-mycol-mint-2 transition-colors"
//                     >
//                       <Camera className="h-5 w-5" />
//                     </motion.button>
//                   </>
//                 )}
//               </div>

//               <div className="flex-1 space-y-4">
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={editedUser.name}
//                     onChange={handleInputChange}
//                     className="text-2xl font-bold text-gray-800 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                   />
//                 ) : (
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     {user.name}
//                   </h2>
//                 )}

//                 <div className="flex items-center space-x-2 text-mycol-sea_green">
//                   <Shield className="h-5 w-5" />
//                   <span className="capitalize font-medium">{user.role}</span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 pt-4">
//                   <div className="space-y-2">
//                     <label className="text-sm text-gray-500">Email</label>
//                     {isEditing ? (
//                       <input
//                         type="email"
//                         name="email"
//                         value={editedUser.email}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                       />
//                     ) : (
//                       <div className="flex items-center space-x-2">
//                         <Mail className="h-5 w-5 text-mycol-sea_green" />
//                         <span className="text-gray-700">{user.email}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm text-gray-500">Phone</label>
//                     {isEditing ? (
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={editedUser.phone || ""}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                       />
//                     ) : (
//                       <div className="flex items-center space-x-2">
//                         <Phone className="h-5 w-5 text-mycol-sea_green" />
//                         <span className="text-gray-700">
//                           {user.phone || "Not specified"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Address Card */}
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
//           >
//             <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//               <MapPin className="h-6 w-6 text-mycol-sea_green mr-2" />
//               Address Information
//             </h3>
//             <div className="grid grid-cols-2 gap-6">
//               {isEditing ? (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Street
//                     </label>
//                     <input
//                       type="text"
//                       name="address.street"
//                       value={editedUser.address?.street || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       name="address.city"
//                       value={editedUser.address?.city || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       State
//                     </label>
//                     <input
//                       type="text"
//                       name="address.state"
//                       value={editedUser.address?.state || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Pincode
//                     </label>
//                     <input
//                       type="text"
//                       name="address.pincode"
//                       value={editedUser.address?.pincode || ""}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint focus:border-transparent"
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="flex items-start space-x-3">
//                     <Home className="h-5 w-5 text-mycol-sea_green mt-1" />
//                     <div>
//                       <p className="text-sm text-gray-500">Street</p>
//                       <p className="text-gray-700">
//                         {user.address?.street || "Not specified"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-3">
//                     <Building2 className="h-5 w-5 text-mycol-sea_green mt-1" />
//                     <div>
//                       <p className="text-sm text-gray-500">City</p>
//                       <p className="text-gray-700">
//                         {user.address?.city || "Not specified"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-3">
//                     <MapPinned className="h-5 w-5 text-mycol-sea_green mt-1" />
//                     <div>
//                       <p className="text-sm text-gray-500">State</p>
//                       <p className="text-gray-700">
//                         {user.address?.state || "Not specified"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-3">
//                     <MapPin className="h-5 w-5 text-mycol-sea_green mt-1" />
//                     <div>
//                       <p className="text-sm text-gray-500">Pincode</p>
//                       <p className="text-gray-700">
//                         {user.address?.pincode || "Not specified"}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Side Information */}
//         <div className="space-y-6">
//           {/* Account Status */}
//           <motion.div
//             initial={{ x: 20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
//           >
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">
//               Account Status
//             </h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span className="text-gray-600">Account Type</span>
//                 <span className="px-3 py-1 bg-mycol-nyanza text-mycol-sea_green rounded-full capitalize font-medium">
//                   {user.role}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span className="text-gray-600">Member Since</span>
//                 <span className="text-gray-800 font-medium">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span className="text-gray-600">Status</span>
//                 <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
//                   Active
//                 </span>
//               </div>
//             </div>
//           </motion.div>

//           {/* Quick Actions */}
//           <motion.div
//             initial={{ x: 20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
//           >
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">
//               Quick Actions
//             </h3>
//             <div className="space-y-3">
//               <motion.button
//                 whileHover={{ x: 5 }}
//                 className="w-full px-4 py-3 text-left text-gray-700 hover:bg-mycol-nyanza rounded-lg transition-colors flex items-center space-x-3"
//               >
//                 <Shield className="h-5 w-5 text-mycol-sea_green" />
//                 <span>View Insurance Policies</span>
//               </motion.button>
//               <motion.button
//                 whileHover={{ x: 5 }}
//                 className="w-full px-4 py-3 text-left text-gray-700 hover:bg-mycol-nyanza rounded-lg transition-colors flex items-center space-x-3"
//               >
//                 <FileText className="h-5 w-5 text-mycol-sea_green" />
//                 <span>Check Claims Status</span>
//               </motion.button>
//               <motion.button
//                 whileHover={{ x: 5 }}
//                 className="w-full px-4 py-3 text-left text-gray-700 hover:bg-mycol-nyanza rounded-lg transition-colors flex items-center space-x-3"
//               >
//                 <Download className="h-5 w-5 text-mycol-sea_green" />
//                 <span>Download Documents</span>
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default UserProfile;
import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Edit2,
  Check,
  Home,
  Building2,
  MapPinned,
  Camera,
  X,
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    address: user.address || {},
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user, address: user.address || {} });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user, address: user.address || {} });
    setPhotoPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditedUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!editedUser.name || !editedUser.email) {
      toast.error("Name and email are required");
      return false;
    }
    if (editedUser.email && !/\S+@\S+\.\S+/.test(editedUser.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.patch("/api/v1/users/updateme", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.data.user);
      setPhotoPreview(null);
      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.success(error.response?.data?.message || "succesfully uploaded");
      setPhotoPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.patch(
        "/api/v1/users/updateme",
        {
          name: editedUser.name,
          email: editedUser.email,
          phone: editedUser.phone,
          address: editedUser.address,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-8 bg-gradient-to-br from-mycol-nyanza/30 to-white min-h-screen"
    >
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-mycol-sea_green" />
          </div>
        </div>
      )}

      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-mycol-brunswick_green to-mycol-mint bg-clip-text text-transparent mb-2">
            Profile Details
          </h1>
          <p className="text-gray-600">
            Manage your account information and settings
          </p>
        </div>
        <div className="flex space-x-4">
          {isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </motion.button>
          ) : null}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isEditing ? handleSave : handleEdit}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              isEditing
                ? "bg-gradient-to-r from-mycol-sea_green to-mycol-dartmouth_green text-white"
                : "bg-gradient-to-r from-mycol-mint to-mycol-mint-2 text-white"
            }`}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isEditing ? (
              <Check className="h-5 w-5" />
            ) : (
              <Edit2 className="h-5 w-5" />
            )}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start space-x-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-mycol-celadon shadow-md">
                  <img
                    src={
                      photoPreview ||
                      user?.photo ||
                      "https://via.placeholder.com/100"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-mycol-mint text-white rounded-full shadow-lg"
                    >
                      <Camera className="h-5 w-5" />
                    </motion.button>
                  </>
                )}
              </div>

              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold text-gray-800 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                )}

                <div className="flex items-center space-x-2 text-mycol-sea_green">
                  <Shield className="h-5 w-5" />
                  <span className="capitalize font-medium">{user.role}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-mycol-sea_green" />
                        <span className="text-gray-700">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedUser.phone || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-mycol-sea_green" />
                        <span className="text-gray-700">
                          {user.phone || "Not specified"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <MapPin className="h-6 w-6 text-mycol-sea_green mr-2" />
              Address Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Street
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={editedUser.address?.street || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={editedUser.address?.city || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={editedUser.address?.state || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={editedUser.address?.pincode || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mycol-mint"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-mycol-sea_green mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Street</p>
                      <p className="text-gray-700">
                        {user.address?.street || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-mycol-sea_green mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="text-gray-700">
                        {user.address?.city || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPinned className="h-5 w-5 text-mycol-sea_green mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="text-gray-700">
                        {user.address?.state || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-mycol-sea_green mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Pincode</p>
                      <p className="text-gray-700">
                        {user.address?.pincode || "Not specified"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Account Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Account Type</span>
                <span className="px-3 py-1 bg-mycol-nyanza text-mycol-sea_green rounded-full capitalize font-medium">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-800 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  Active
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ x: 5 }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-mycol-nyanza rounded-lg transition-colors flex items-center space-x-3"
              >
                <Shield className="h-5 w-5 text-mycol-sea_green" />
                <span>View Insurance Policies</span>
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-mycol-nyanza rounded-lg transition-colors flex items-center space-x-3"
              >
                <FileText className="h-5 w-5 text-mycol-sea_green" />
                <span>Check Claims Status</span>
              </motion.button>
              <motion.button
                whileHover={{ x: 5 }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-mycol-nyanza rounded-lg transition-colors flex items-center space-x-3"
              >
                <Download className="h-5 w-5 text-mycol-sea_green" />
                <span>Download Documents</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
