import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [userImage, setUserImage] = useState(null);
  const [description, setDescription] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const [descRes, nameRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/user/profile?email=${email}`),
          axios.get(`http://localhost:8080/api/user/username/${email}`)
        ]);

        const profile = descRes.data;
        const username = nameRes.data;

        setDescription(`"${profile.description}" ~ ${username}`);

        if (profile.profileImage) {
          setUserImage(`data:image/jpeg;base64,${profile.profileImage}`);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 relative">
        
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-xl shadow-md">
          <h1 className="text-xl font-bold ml-11 hover:text-purple-200 transition">
            <a href="/home">🏠 Home</a>
          </h1>
          <div ref={dropdownRef}>
            <ProfileDropdown isOpen={dropdownOpen} setIsOpen={setDropdownOpen} />
          </div>
        </header>

        {/* Content */}
        <section className="flex flex-1 flex-col md:flex-row items-center justify-center mt-10 gap-10 px-2">
          {/* Quote Section */}
          <div className="flex-1 text-center md:text-left">
            <blockquote className="text-lg md:text-xl font-medium text-gray-300 italic max-w-md ml-auto mr-auto md:ml-20">
              "The key is not to prioritize what’s on your schedule, but to schedule your priorities."
              <span className="block mt-4 text-sm text-purple-400">– Stephen Covey</span>
            </blockquote>
          </div>

          {/* Profile Section */}
          <div className="flex-1 flex flex-col items-center space-y-6 text-center">
            {userImage ? (
              <img
                src={userImage}
                alt="User Profile"
                className="w-60 h-60 rounded-full border-4 border-purple-500 shadow-2xl object-cover"
              />
            ) : (
              <div className="w-60 h-60 flex items-center justify-center bg-white/10 rounded-full border border-white text-sm text-gray-400">
                No Image
              </div>
            )}

            <p className="text-indigo-200 max-w-xl text-lg px-4 break-words">
              {description || "No description available."}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
