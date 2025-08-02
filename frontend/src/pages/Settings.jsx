import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import axios from 'axios';

export default function Settings() {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // 📦 Fetch existing user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        const res = await axios.get(`http://localhost:8080/api/user/profile?email=${email}`);

        if (res.data.description) {
          setDescription(res.data.description);
        }

        if (res.data.profileImage) {
          setPreview(`data:image/jpeg;base64,${res.data.profileImage}`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!profilePic && !description) {
      setMessage("❗ Nothing to update.");
      return;
    }

    const formData = new FormData();
    if (profilePic) formData.append("file", profilePic);
    formData.append("description", description);
    const userEmail = localStorage.getItem("email");
    formData.append("email", userEmail);

    try {
      await axios.post("http://localhost:8080/api/user/update-profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1e2f] via-[#2a2a40] to-[#1e1e2f] text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white/10 p-8 rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-8">⚙️ Profile Settings</h2>

        {/* Profile Pic Upload */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-full border-4 border-indigo-500 shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-white/20 border border-white/30 rounded-full text-white text-sm">
              No Image
            </div>
          )}

          <label className="cursor-pointer flex items-center gap-2 text-indigo-300 hover:underline">
            <UploadCloud size={18} />
            Upload Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2 text-indigo-200 text-sm">Description</label>
          <textarea
            className="w-full p-3 rounded-lg bg-gray-100/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            rows={4}
            placeholder="Write a short bio or description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
        >
          💾 Save Changes
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-green-400">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
