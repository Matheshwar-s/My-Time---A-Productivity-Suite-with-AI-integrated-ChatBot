import React from "react";

export function Button({ children, onClick, variant = "default", className = "" }) {
  const baseClass =
    "px-4 py-2 rounded text-white font-semibold transition " +
    (variant === "default"
      ? "bg-blue-600 hover:bg-blue-700"
      : "border border-gray-400 text-gray-700 hover:bg-gray-100");

  return (
    <button onClick={onClick} className={`${baseClass} ${className}`}>
      {children}
    </button>
  );
}
