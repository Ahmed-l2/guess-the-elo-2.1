import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { topPlayers } from '../TopPlayers';

function PlayersPopup({onClose, isVisible}) {
  if (!isVisible) return null;

  const [attempts, setAttempts] = useState(0);
  const [correctPlayer] = useState(() => topPlayers[Math.floor(Math.random() * topPlayers.length)]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [guessedPlayers, setGuessedPlayers] = useState([]);

  const handlePlayerGuess = (player) => {
    if (player.name === correctPlayer.name) {
      setShowAnswer(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setGuessedPlayers([...guessedPlayers, player.name]);
      if (newAttempts >= 3) {
        setShowAnswer(true);
      }
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
              <h1 className='w-full p-2 text-white font-bold text-xl'>Pick a player</h1>
             
              <ul className="space-y-2">
                {topPlayers.filter(player => !guessedPlayers.includes(player.name)).map((player) => (
                  <li 
                    key={player.name} 
                    onClick={() => handlePlayerGuess(player)}
                    className={`${showAnswer && player.name === correctPlayer.name ? 'bg-green-500' : 'bg-secnd'} cursor-pointer p-2 rounded-lg text-white font-semibold hover:bg-accent transition-all hover:scale-105 flex items-center gap-3`}
                  >
                    <img src={player.img} alt={player.name} className="w-10 h-10 rounded-full" />
                    {player.name}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onClose}
                    className="bg-gray-500 p-3 rounded-lg text-white font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={onClose}
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

export default PlayersPopup;