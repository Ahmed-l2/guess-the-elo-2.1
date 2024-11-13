import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import blunder from '/icons/blunder.png'
import brilliant from '/icons/brilliant.png'
import inaccuracy from '/icons/inaccuracy.png'
import mistake from '/icons/mistake.png'
import great from '/icons/great.png'

function ResultPopup({ guess, average, wElo, bElo, gamelink, onClose, isVisible, bgColor, loadPGN }) {
  if (!isVisible) return null;



  const getComment = () => {
    const difference = Math.abs(guess - average);

    if (difference === 0) {
      return {
        message: "Perfect! You nailed it exactly. Are you secretly a grandmaster...interesting?",
        color: "bg-[#1bada6]",
        icon: brilliant,
        animate: true
      };
    } else if (difference <= 5) {
      return {
        message: "Incredible! Your rating guess is basically telepathic. Ever considered a career in chess analytics?",
        color: "bg-[#1bada6]",
        icon: brilliant
      };
    } else if (difference <= 20) {
      return {
        message: "Very impressive! You're just a few points off. Keep this up, and you'll be the human equivalent of a chess engine.",
        color: "bg-[#5c8bb0]",
        icon: great
      };
    } else if (difference <= 50) {
      return {
        message: guess > average
          ? "Close, but you're giving too much credit! Tone it down a bit."
          : "Close, but you're underselling them! This player has a bit more skill.",
        color: "bg-[#5c8bb0]",
        icon: great
      };
    } else if (difference <= 100) {
      return {
        message: guess > average
          ? "Not bad, but you overshot by a fair bit. Try dialing it down a notch!"
          : "Not bad, but you undershot by a fair bit. Give them some more respect!",
        color: "bg-[#f7c045]",
        icon: inaccuracy
      };
    } else if (difference <= 250) {
      return {
        message: guess > average
          ? "Oof, that's quite a leap! Maybe cool it on the optimism?"
          : "Ouch, you're way underestimating! This player deserves a bit more credit.",
        color: "bg-[#e58f2a]",
        icon: mistake
      };
    } else if (difference <= 500) {
      return {
        message: guess > average
          ? "Well, that was... ambitious. Are we guessing ratings or launching rockets?"
          : "Harsh! You might have just insulted this player in two different languages.",
        color: "bg-[#ca3431]",
        icon: blunder
      };
    } else {
      return {
        message: guess > average
          ? "Whoa, calm down! This player isn't exactly Hikaru."
          : "Wow, did you guess by rolling dice? Because that rating is way off!",
        color: "bg-[#ca3431]",
        icon: blunder
      };
    }
  };

  const comment = getComment();

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

              <div className="bg-secnd shadow-lg rounded-lg p-4 text-center transition-transform hover:scale-105">
                <p className="text-xs text-gray-400 mb-2">Average ELO</p>
                <p className="text-3xl font-bold text-white">{average}</p>
              </div>

              <motion.div 
                className={`${comment.color} rounded-lg p-4 shadow-lg flex flex-col items-center relative`}
                animate={comment.animate ? {
                  backgroundColor: ['#1bada6', '#ffffff', '#1bada6'],
                } : {}}
                transition={comment.animate ? {
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                } : {}}
              >
                <img src={comment.icon} className="absolute top-1 left-1 h-10 " />
                <p className={` text-3xl font-bold text-white mb-4 `}>{guess}</p>
                <p className={` font-bold text-2xl text-center text-white `}>
                  {comment.message}
                </p>
              </motion.div>

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