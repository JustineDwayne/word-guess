'use client';
import { useRef } from "react";
import Button from "./Button";

export default function Modal({ word, firstDefinition, onClose, status, desc, phonetics, phoneticsAudio, partsOfSpeech, firstExample }) {
  const audioRef = useRef(null);

  const handlePlayAudio = () => {
    if (phoneticsAudio) {
      new Audio(phoneticsAudio).play();
    }
  };

  const formatWord = word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex justify-center items-center gap-2">
      <div className="bg-white p-6 rounded shadow-xl w-[300px]">
        <h2 className="text-xl font-bold mb-2">{status}</h2>
        <h2 className="text-xl font-bold">{desc}</h2>
        <p className="font-bold text-2xl"><strong>{formatWord}</strong></p>
        <p className="font-extralight">{partsOfSpeech}</p>
        {/* Pronunciation Audio */}
        <div className="mb-2 flex flex-row gap-2">
          {phoneticsAudio ? (
            <button
              onClick={handlePlayAudio}
              className="p-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 text-sm"
            >
              🔊
            </button>
          ) : (
            <p className="text-sm text-gray-500">No audio available</p>
          )}
          <p className="mt-2">
            <strong>{phonetics}</strong>
          </p>
        </div>

        <p><strong>Definition:</strong> {firstDefinition}</p>

        <div className="flex justify-evenly mt-4">
          <Button label="Play Again" onClick={onClose} />
          <Button label="Home" onClick={() => window.location.href = '/'} />
        </div>
      </div>
    </div>
  );
}
