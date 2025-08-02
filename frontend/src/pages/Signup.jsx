import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import signupImg from '../assets/login.jpg';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/signup', formData);
      setMessage('Signup successful! You can now log in.');
      setSuccess(true);
    } catch (err) {
      setMessage('Signup failed. Please try again.');
      setSuccess(false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-4">
      <div className="relative flex flex-col md:flex-row items-center bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-5xl border border-white/20 overflow-hidden">

        {/* Blurred Floating Backgrounds */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1.1 }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", repeatType: "reverse" }}
          className="absolute top-10 left-10 w-20 h-20 bg-purple-400 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.1, y: -30 }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", repeatType: "reverse" }}
          className="absolute bottom-10 right-10 w-28 h-28 bg-pink-500 rounded-full blur-2xl"
        />

        {/* LEFT - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block md:w-1/2"
        >
          <img
            src={signupImg}
            alt="Signup Illustration"
            className="w-full object-contain drop-shadow-xl"
          />
        </motion.div>

        {/* RIGHT - Signup Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 w-full bg-white/20 rounded-2xl p-8 shadow-lg space-y-6 text-white border border-white/20"
        >
          <h2 className="text-4xl font-extrabold text-center text-purple-300 drop-shadow-md">
            ✨ Create Account
          </h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            aria-label="Username"
            autoComplete="username"
            className="w-full p-3 rounded-lg bg-gray-100/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            className="w-full p-3 rounded-lg bg-gray-100/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete="new-password"
            className="w-full p-3 rounded-lg bg-gray-100/90 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
          >
            🚀 Sign Up
          </button>

          <p className="text-center text-sm text-purple-200">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-white hover:underline">
              Login
            </Link>
          </p>

          {message && (
            <p className={`text-center text-sm mt-2 ${success ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </motion.form>
      </div>
    </div>
  );
}
