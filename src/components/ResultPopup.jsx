import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ResultPopup({ guess, average, wElo, bElo, gamelink, onClose, isVisible, bgColor, loadPGN }) {
  if (!isVisible) return null;

  const subReaction = () => {
    if (guess > average && (guess - average) < 100 && (guess - average) > 50 || guess < average && (average - guess) < 100 && (average - guess) > 50) {
      return 'text-red-500'
    } else if (guess > average && (guess - average) <= 50 && (guess - average) > 5 || guess < average && (average - guess) <= 50 && (average - guess) > 5) {
      return 'text-[#63cdda]'
    } else if (guess > average && (guess - average) <= 10 && (guess - average) > 0 || guess < average && (average - guess) <= 10 && (average - guess) > 0) {
      return 'text-[#81ecec]'
    } else if (guess > average && (guess - average) >= 100 || guess < average && (average - guess) >= 100) {
      return 'text-[#b33939]'
    } else if (guess == average) {
      return 'text-[#fff]'
    }
  }

  const getComment = () => {
    const difference = Math.abs(guess - average);

    if (difference === 0) {
      return {
        message: "Perfect! You nailed it exactly. Are you secretly a grandmaster?",
        color: "text-green-500"
      };
    } else if (difference <= 5) {
      return {
        message: "Incredible! Your rating guess is basically telepathic. Ever considered a career in chess analytics?",
        color: "text-green-400"
      };
    } else if (difference <= 20) {
      return {
        message: "Very impressive! You're just a few points off. Keep this up, and you'll be the human equivalent of a chess engine.",
        color: "text-blue-500"
      };
    } else if (difference <= 50) {
      return {
        message: guess > average
          ? "Close, but you're giving too much credit! Tone it down a bit."
          : "Close, but you're underselling them! This player has a bit more skill.",
        color: "text-blue-400"
      };
    } else if (difference <= 100) {
      return {
        message: guess > average
          ? "Not bad, but you overshot by a fair bit. Try dialing it down a notch!"
          : "Not bad, but you undershot by a fair bit. Give them some more respect!",
        color: "text-yellow-500"
      };
    } else if (difference <= 250) {  // increased from 200
      return {
        message: guess > average
          ? "Oof, that’s quite a leap! Maybe cool it on the optimism?"
          : "Ouch, you're way underestimating! This player deserves a bit more credit.",
        color: "text-yellow-600"
      };
    } else if (difference <= 500) {  // increased from 400
      return {
        message: guess > average
          ? "Well, that was... ambitious. Are we guessing ratings or launching rockets?"
          : "Harsh! You might have just insulted this player in two different languages.",
        color: "text-red-500"
      };
    } else {
      return {
        message: guess > average
          ? "Whoa, calm down! This player isn’t exactly Magnus Carlsen."
          : "Wow, did you guess by rolling dice? Because that rating is way off!",
        color: "text-red-700"
      };
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed z-10 inset-0 flex justify-center items-center backdrop-blur-sm bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-primary w-[98%] sm:w-[500px] rounded-2xl p-6 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-4 text-center transition-transform hover:scale-105">
                  <p className="text-xs text-gray-500 mb-1">White ELO</p>
                  <p className="text-2xl font-bold">{wElo}</p>
                </div>
                <div className="bg-black rounded-lg p-4 text-center transition-transform hover:scale-105">
                  <p className="text-xs text-gray-400 mb-1">Black ELO</p>
                  <p className="text-2xl font-bold text-white">{bElo}</p>
                </div>
              </div>

              <div className="bg-secnd rounded-lg p-4 text-center transition-transform hover:scale-105">
                <p className="text-xs text-gray-400 mb-2">Average ELO</p>
                <p className="text-3xl font-bold text-white">{average}</p>
              </div>

              <div className="bg-secnd rounded-lg p-4 flex flex-col items-center">
                <p className={`${subReaction()} text-2xl font-bold mb-4 ${getComment().color}`}>{guess}</p>
                <p className={`${subReaction()} font-bold text-center ${getComment().color}`}>
                  {getComment().message}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={gamelink}
                  target="_blank"
                  className="bg-green-500 p-3 rounded-lg text-white font-semibold text-center hover:bg-green-600 transition-colors"
                >
                  View Game
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onClose}
                    className="bg-gray-500 p-3 rounded-lg text-white font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={loadPGN}
                    className="bg-accent p-3 rounded-lg text-white font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Next Game
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ResultPopup;
