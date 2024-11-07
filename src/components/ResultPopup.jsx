import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ResultPopup({ guess, average, wElo, bElo, gamelink, onClose, isVisible, bgColor }) {
  if (!isVisible) return null;

  const subReaction = () => {
    if (guess > average && (guess - average) < 100 && (guess - average) > 50 || guess < average && (average - guess) < 100 && (average - guess) > 50) {
      return 'bg-red-500'
    } else if (guess > average && (guess - average) <= 50 && (guess - average) > 5 || guess < average && (average - guess) <= 50 && (average - guess) > 5) {
      return 'bg-[#63cdda]'
    } else if (guess > average && (guess - average) <= 10 && (guess - average) > 0 || guess < average && (average - guess) <= 10 && (average - guess) > 0) {
      return 'bg-[#81ecec]'
    } else if (guess > average && (guess - average) >= 100 || guess < average && (average - guess) >= 100) {
      return 'bg-[#b33939]'
    } else if (guess == average) {
      return 'bg-[#fff]'
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

              <div className="bg-secnd rounded-lg overflow-hidden">
                <p className="text-xs text-gray-400 p-2 border-b border-gray-700">Your Guess</p>
                <p className={`${subReaction()} text-white text-2xl font-bold p-4 transition-all`}>{guess}</p>
              </div>

              <div className={`${subReaction()} rounded-lg p-4`}>
                <p className="text-xs text-gray-400 mb-2">Comments</p>
                {Math.abs(guess - average) <= 100 ? (
                  <p className="text-white font-medium">Excellent guess! You were very close to the actual rating.</p>
                ) : Math.abs(guess - average) <= 300 ? (
                  <p className="text-white font-medium">Good try! You were in the right ballpark.</p>
                ) : (
                  <p className="text-white font-medium">Keep practicing! Your guess was quite far from the actual rating.</p>
                )}
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
                    onClick={() => location.reload()}
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