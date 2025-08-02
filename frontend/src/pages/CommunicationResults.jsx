import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CommunicationResults() {
  const { state } = useLocation();
  const result = state?.result;
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

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-900 via-purple-950 to-black">
        <p>Error: No results found. Please retry the test.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 mt-5 mx-4 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-600 shadow-md rounded-xl">
          <h1 className="ml-14 text-xl font-bold hover:text-purple-200 transition">
            📝 Communication Results
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

        <main className="p-6 flex justify-center items-start">
          <div className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">🎉 Great Job!</h2>

            <p className="text-lg mb-2">
              <strong>🧠 Score:</strong> {result.score}/10
            </p>
            <p className="text-lg mb-2">
              <strong>📈 Level:</strong> {result.level}
            </p>

            <p className="mt-4 text-purple-200 font-semibold">💬 Feedback:</p>
            <p className="text-gray-300 italic">{result.feedback}</p>

            {Array.isArray(result.tips) && result.tips.length > 0 && (
              <>
                <p className="mt-4 text-purple-200 font-semibold">🛠️ Tips to Improve:</p>
                <ul className="list-disc ml-6 mt-2 text-gray-200 space-y-1">
                  {result.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-6">
              <button
                onClick={() => navigate("/communication/test")}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded text-white font-bold transition hover:scale-105"
              >
                Retry Test
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
