'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function Tiles({ length, onInputChange, hintMap = {} }) {
  const [letters, setLetters] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const initialLetters = Array(length).fill('');
    Object.entries(hintMap).forEach(([i, letter]) => {
      initialLetters[i] = letter.toUpperCase();
    });
    setLetters(initialLetters);
  }, [length, hintMap]);

  const handleChange = (value, index) => {
    if (hintMap[index]) return;

    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);

    // Notify parent of updated guess
    onInputChange(newLetters.join(''));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !letters[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-wrap justify-start gap-2 w-full max-w-full">
      {letters.map((letter, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          maxLength={1}
          value={letter}
          onChange={(e) => handleChange(e.target.value, i)}
          disabled={hintMap[i]}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-500 rounded text-lg sm:text-xl"
        />
      ))}
    </div>
  );
}
