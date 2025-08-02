import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";

export default function CommunicationPage() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/user/profile?email=${email}`);
        if (res.data.profileImage) {
          setUserImage(`data:image/jpeg;base64,${res.data.profileImage}`);
        }
      } catch (err) {
        console.error("Failed to load user profile image:", err);
      }
    };
    if (email) fetchProfile();
  }, [email]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 mt-5 mx-4 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-600 shadow-md rounded-xl">
          <h1 className="ml-14 text-xl font-bold hover:text-purple-200 transition flex items-center gap-2">
            <Sidebar />
            <a href="/home">🗣️ Communication</a>
          </h1>
          {userImage ? (
            <img
              src={userImage}
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <ProfileDropdown />
          )}
        </header>

        {/* Spacer below header */}
        <div className="h-[92px]" />

        {/* Motivational Centered Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-8">
            <div className="text-5xl mb-4 animate-pulse">🎙️</div>
            <h2 className="text-3xl font-bold text-indigo-300 mb-4">
              Speak with Confidence. Shine with Clarity.
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto italic">
              “The most powerful tool you have is your voice. Let the world hear it.”
            </p>
          </div>

          <button
            onClick={() => navigate("/communication/test")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105"
          >
            🎤 Start Your Communication Test
          </button>
        </main>
      </div>
    </div>
  );
}
