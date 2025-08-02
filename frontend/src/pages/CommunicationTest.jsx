import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MicRecorder from "../components/MicRecorder";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";
import axios from "axios";

const prompts = [
  "Tell me about yourself.",
  "Describe a challenge you faced and how you overcame it.",
];

export default function CommunicationTest() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [current, setCurrent] = useState(0);
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

  const handleNext = (audioUrl) => {
    const updatedResponses = [...responses, audioUrl];
    if (current + 1 < prompts.length) {
      setResponses(updatedResponses);
      setCurrent(current + 1);
    } else {
      // Submit all responses
      fetch("http://localhost:8080/api/communication/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          prompts,
          responses: updatedResponses,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          navigate("/communication/results", { state: { result: data } });
        });
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 mt-5 mx-4 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-600 shadow-md rounded-xl">
          <h1 className="ml-14 text-xl font-bold hover:text-purple-200 transition flex items-center gap-2">
            <Sidebar />
            <a href="/home">🧠 Communication Test</a>
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

        {/* Spacer for Header */}
        <div className="h-[92px]" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="text-4xl animate-pulse">🎤</div>
          <h2 className="text-2xl font-semibold text-indigo-300">
            Question {current + 1} of {prompts.length}
          </h2>
          <p className="text-lg text-gray-300 italic max-w-2xl">
            {prompts[current]}
          </p>

          <MicRecorder onDone={handleNext} />
        </main>
      </div>
    </div>
  );
}
