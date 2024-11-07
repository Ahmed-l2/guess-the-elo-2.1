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
    if (guess > average && (guess - average) < 100 && (guess - average) > 50 || guess < average && (average - guess) < 100 && (average - guess) > 50) {
      return "Close, but a bit high! Keep refining your rating sense."
    } else if (guess > average && (guess - average) <= 50 && (guess - average) > 5 || guess < average && (average - guess) <= 50 && (average - guess) > 5) {
      return "Very good! You're getting the hang of rating estimation!"
    } else if (guess > average && (guess - average) <= 10 && (guess - average) > 0 || guess < average && (average - guess) <= 10 && (average - guess) > 0) {
      return "Excellent! Your rating sense is spot on!"
    } else if (guess > average && (guess - average) >= 100 || guess < average && (average - guess) >= 100) {
      return "Quite far off. Try to analyze the moves more carefully!"
    } else if (guess == average) {
      return "Perfect! You nailed the exact rating!"
    }
  }

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
            className="bg-primary w-[98%] md:w-[500px] rounded-2xl p-6 shadow-2xl"
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
                <p className={`${subReaction()} text-white text-2xl font-bold mb-4`}>{guess}</p>
                <p className={`${subReaction()} font-bold text-center`}>{getComment()}</p>
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