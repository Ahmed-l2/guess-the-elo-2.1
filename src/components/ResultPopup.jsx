import React from 'react';

function ResultPopup({ guess, average, wElo, bElo, title, result, gamelink, termination, onClose, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed z-10 inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">Player Guess: {guess}</p>
        <p className="text-gray-700 mb-6">Average Elo: {average}</p>
        <p className="text-gray-700 mb-6">White Elo: {wElo}</p>
        <p className="text-gray-700 mb-6">Black Elo: {bElo}</p>
        <p className="text-gray-700 mb-6">{result}</p>
        <p className="text-gray-700 mb-6">{termination}</p>
        <p className="text-gray-700 mb-6">{gamelink}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >Close</button>
      </div>
    </div>
  );
}

export default ResultPopup;
