// components/Modal.js
import Button from "./Button";

export default function Modal({ word, firstDefinition, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-xl w-[300px]">
        <h2 className="text-xl font-bold mb-2">🎉 Correct!</h2>
        <h2 className="text-xl font-bold mb-2">You guessed the word:</h2>
        <p><strong>Word:</strong> {word}</p>
        <p><strong>Definition:</strong> {firstDefinition}</p>
        <Button label="Play Again" onClick={onClose} />
      </div>
    </div>
  );
}
