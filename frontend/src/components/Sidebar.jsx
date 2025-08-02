import { useState } from 'react';
import { Code, ClipboardList, MessageCircle, Menu, X , Bot} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-11 left-11 z-50 p-1 rounded-full shadow-lg transition-all duration-300 
          ${isOpen ? 'left-60 top-90 bg-purple-700 hover:bg-purple-800 text-white' : 'bg-black text-purple-700 hover:bg-gray-100'}`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-violet-900 border-r border-white/20 transition-transform duration-300 z-40 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Navigation</h2>
          <nav className="space-y-4 text-gray-200 text-sm">
            <a href="/code" className="flex items-center space-x-2 hover:text-white">
              <Code size={18} /> <span>Code Area</span>
            </a>
            <a href="/task" className="flex items-center space-x-2 hover:text-white">
              <ClipboardList size={18} /> <span>Task Manager</span>
            </a>
            <a href="/communication" className="flex items-center space-x-2 hover:text-white">
              <MessageCircle size={18} /> <span>Communication</span>
            </a>
            <a href="/chatbot" className="flex items-center space-x-2 hover:text-white">
              <Bot size={18} /> <span>AI Assistant</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
