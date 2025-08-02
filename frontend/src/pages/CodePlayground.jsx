import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";

export default function CodePlayground() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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

  const runCode = async () => {
    setIsRunning(true);
    try {
      const res = await axios.post("http://localhost:8080/api/code/execute", { code, language });
      setOutput(res.data.output);
    } catch (err) {
      setOutput("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 mt-5 mx-4 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-600 shadow-md rounded-xl">
          <h1 className="ml-14 text-xl font-bold hover:text-purple-200 transition">
            <Sidebar />
            <a href="/home">💻 Code Playground</a>
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

        {/* Spacer to prevent header overlap */}
        <div className="h-[92px]" />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label htmlFor="language" className="text-lg font-medium text-indigo-300">
              Select Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="python">🐍 Python</option>
              <option value="java">☕ Java</option>
              <option value="cpp">🔧 C++</option>
              <option value="javascript">⚡ JavaScript</option>
            </select>
          </div>

          <Editor
            height="400px"
            defaultLanguage={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            className="rounded-lg border border-indigo-700 shadow-lg"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={`px-8 py-3 rounded font-bold transition transform shadow-lg ${
                isRunning
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
              }`}
            >
              {isRunning ? "⏳ Running..." : "🚀 Run Code"}
            </button>
            <span className="text-sm text-gray-400">Powered by your backend API</span>
          </div>

          <div className="bg-black text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap shadow-inner border border-green-500">
            {output || "// Output will appear here"}
          </div>
        </main>
      </div>
    </div>
  );
}
