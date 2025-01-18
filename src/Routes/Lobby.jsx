import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, Settings, Play } from 'lucide-react'
import { useParams, useLocation } from 'react-router-dom'
import { databases, client } from "../lib/appwrite"

function Lobby() {
  const [rounds, setRounds] = useState(0)
  const [timePerRound, setTimePerRound] = useState(0)
  const [players, setPlayers] = useState([])
  const { id } = useParams()

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await databases.getDocument(
          "672e683c001beba0b2a6",
          "678ad4ab0017e805fec9",
          id
        )
        
        // Set rounds
          setRounds(response.rounds);
          setPlayers(response.players); 
          setTimePerRound(response.time_per_round);


      } catch (error) {
        console.error("Error fetching party data:", error);
      }
    }

    fetchPartyData();

    const unsubscribe = client.subscribe(
      `databases.672e683c001beba0b2a6.collections.678ad4ab0017e805fec9.documents.${id}`,
      response => {
        setRounds(response.payload.rounds);
        setPlayers(response.payload.players);
        setTimePerRound(response.payload.time_per_round);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [id]);

  console.log("Fetched players:",players);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='flex flex-col justify-center items-center w-full min-h-screen relative overflow-hidden  px-4 sm:px-6'
    >
      <motion.h1
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-luckiest font-bold text-white mb-2 animate-pulse text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
      >
      Party Lobby
      </motion.h1>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-6xl mx-auto p-2 sm:p-4"
      >
        <div className="bg-white/10 border-2 border-white/20 rounded-xl p-3 sm:p-4 mb-4">
          <h2 className="text-white  font-luckiest text-lg sm:text-xl mb-2">Party Code</h2>
          <div className="bg-white/20 p-2 sm:p-3 rounded-lg text-white font-mono break-all select-all text-sm sm:text-base">
          {id}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="bg-white/10 border-2 border-white/20 rounded-xl p-3 sm:p-4 h-full">
              <h2 className="text-white font-luckiest text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
                <Settings size={20} className="sm:w-6 sm:h-6" />
                Game Settings
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col text-white gap-1 sm:gap-2">
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    Number of Rounds:
                  </label>
                  <input
                    type="number"
                    value={rounds}
                    onChange={(e) => setRounds(Number(e.target.value))}
                    className="bg-white/10 border-2 font-extrabold border-white/20 rounded-lg p-1.5 sm:p-2 w-full text-center text-sm sm:text-base"
                    min="1"
                    max="10"
                  />
                </div>
                <div className="flex flex-col text-white gap-1 sm:gap-2">
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <Clock size={16} className="sm:w-5 sm:h-5" />
                    Time per Round (seconds):
                  </label>
                  <input
                    type="number"
                    value={timePerRound}
                    onChange={(e) => setTimePerRound(Number(e.target.value))}
                    className="bg-white/10 border-2 font-extrabold border-white/20 rounded-lg p-1.5 sm:p-2 w-full text-center text-sm sm:text-base"
                    min="10"
                    max="120"
                    step="5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white/10 border-2 border-white/20 rounded-xl p-3 sm:p-4 h-full">
              <h2 className="text-white font-luckiest text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
                <Users size={20} className="sm:w-6 sm:h-6" />
                Players ({players?.length || 0})
              </h2>
              <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {players.map((player,index) => (
                  console.log("Player:",player),
                  <div key={index} className="flex items-center justify-between text-white p-1.5 sm:p-2 bg-white/5 rounded-lg text-sm sm:text-base">
                    <span className='text-white'>{player.username}</span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {player.isHost === "true" ? (
                        <span className="text-yellow-600 text-xs sm:text-sm">Host</span>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm">Player</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>        
        </div>
        <button
          className="w-full mt-3 sm:mt-4 p-3 sm:p-4 text-base sm:text-lg font-luckiest bg-orange-400 border-2 border-white/20 rounded-xl text-white hover:bg-green-500/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25"
        >
          <Play size={20} className="sm:w-6 sm:h-6" />
          Start Game
        </button>
      </motion.div>
    </motion.div>
  )
}

export default Lobby