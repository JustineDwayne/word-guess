'use client';

import React from 'react';

// Simple reusable Button component with fixed style and customizable colors
function Button({ label, onClick, textColor = 'text-white', bgColor = 'bg-blue-500', disabled = false, className = '' }) {
  // Fixed Tailwind styles with customizable text and background colors
  const styles = `inline-flex items-center justify-center rounded-md px-4 py-2 font-medium ${textColor} ${bgColor} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {label}
    </button>
  );
}

export default Button;