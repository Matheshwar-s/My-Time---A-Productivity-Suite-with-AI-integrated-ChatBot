import { useState, useEffect } from "react";
import axios from "axios";
import { Bot, User, ClipboardCopy, Trash2, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Chatbot() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [newName, setNewName] = useState("");

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/user/profile?email=${email}`);
        const name = await axios.get(`http://localhost:8080/api/user/username/${email}`);
        setUsername(name.data);
        if (res.data.profileImage) {
          setUserImage(`data:image/jpeg;base64,${res.data.profileImage}`);
        }
      } catch (err) {
        console.error("Failed to load user info:", err);
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/chat/sessions?email=${email}`);
        if (Array.isArray(res.data)) {
          setSessions(res.data);
          if (res.data.length) setSelectedSessionId(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
      }
    };

    fetchProfile();
    fetchSessions();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedSessionId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/chat/messages?sessionId=${selectedSessionId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
  }, [selectedSessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/chatbot", { message: input });
      const botReply = res?.data?.reply || "No reply";
      const botMsg = { sender: "bot", text: botReply };

      const saveResponse = await axios.post("http://localhost:8080/api/chat/save", {
        sessionId: selectedSessionId,
        email,
        name: username,
        messages: [userMsg, botMsg],
      });

      // If new session, update the list and select it
      if (!selectedSessionId) {
        const newId = saveResponse.data.sessionId;
        const sessionsRes = await axios.get(`http://localhost:8080/api/chat/sessions?email=${email}`);
        setSessions(sessionsRes.data);
        setSelectedSessionId(newId);
      }

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat send failed:", err.response?.data || err.message);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "⚠️ Something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    setSelectedSessionId(null);
    setMessages([]);
    setInput("");
  };

  const deleteChat = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:8080/api/chat/session-delete/${sessionId}`);
      const updated = sessions.filter(s => s.id !== sessionId);
      setSessions(updated);
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(updated.length ? updated[0].id : null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const renameChat = async (sessionId) => {
    try {
      
      await axios.put(`http://localhost:8080/api/chat/session-rename/${sessionId}`, { name: newName });
      const updated = sessions.map(s => s.id === sessionId ? { ...s, name: newName } : s);
      setSessions(updated);
      setRenamingSessionId(null);
      setNewName("");
      console.log("hi");
    } catch (err) {
      console.error("Failed to rename session:", err);
    }
  };

  const MarkdownRenderer = ({ children }) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const language = /language-(\w+)/.exec(className || "")?.[1];
          return !inline ? (
            <div className="relative group">
              <button
                onClick={() => navigator.clipboard.writeText(children)}
                className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                <ClipboardCopy size={12} />
              </button>
              <SyntaxHighlighter
                language={language}
                style={a11yDark}
                PreTag="div"
                className="rounded"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-gray-800 text-white px-1 py-0.5 rounded">{children}</code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-64 z-40 bg-indigo-950 border-r border-indigo-800 p-4 text-white overflow-y-auto">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">Chats</h2>
    <button
      onClick={createNewChat}
      className="text-sm bg-indigo-700 px-2 py-1 rounded hover:bg-indigo-600"
    >
      + New
    </button>
  </div>
  <ul className="space-y-2">
    {sessions.map((session) => (
      <li
        key={session.id}
        className={`p-2 rounded cursor-pointer hover:bg-indigo-700 ${
          selectedSessionId === session.id ? "bg-indigo-700" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <div
            onClick={() => setSelectedSessionId(session.id)}
            className="flex-1 cursor-pointer"
          >
            {renamingSessionId === session.id ? (
              <input
                type="text"
                className="bg-indigo-900 px-2 py-1 rounded text-white w-full"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && renameChat(session.id)}
              />
            ) : (
              session.chatName || "Untitled"
            )}
          </div>
          <div className="ml-2 flex gap-1">
            <Pencil
              size={14}
              className="cursor-pointer"
              onClick={() => {
                setRenamingSessionId(session.id);
                setNewName(session.chatName || "Untitled");
              }}
            />
            <Trash2
              size={14}
              className="cursor-pointer text-red-400"
              onClick={() => deleteChat(session.id)}
            />
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>


        {/* Chat Area */}
        <div className="pl-64 flex-1 flex flex-col relative">
           <header className="fixed top-0 left-65 right-0 z-50 mt-5 mx-4 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-600 shadow-md rounded-xl">
                    <h1 className="ml-14 text-xl font-bold hover:text-purple-200 transition flex items-center gap-2">
                      <a href="/home">🗣️ AI assistant</a>
                    </h1>
            {userImage && (
              <img src={userImage} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white" />
            )}
          </header>

          <div className="mt-24 flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-black/10 backdrop-blur-md">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end space-x-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="p-2 rounded-full bg-indigo-600">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[75%] text-sm shadow-lg whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-gray-100 text-black rounded-bl-none"
                  }`}
                >
                  <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                </div>
                {msg.sender === "user" && (
                  <div className="p-2 rounded-full bg-white">
                    <User size={18} className="text-indigo-600" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center space-x-3 animate-pulse">
                <div className="p-2 rounded-full bg-indigo-600">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-gray-200 text-black px-4 py-2 rounded-2xl text-sm">Typing...</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-100 border-t">
            <div className="flex rounded-lg overflow-hidden shadow-md">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-white focus:outline-none text-black"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
