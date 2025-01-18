import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, Settings, Play, Crown ,Clipboard} from 'lucide-react'
import { useParams, useLocation } from 'react-router-dom'
import { databases, client } from "../lib/appwrite"
import { user } from "../GlobalContext/atoms"
import { useAtomValue } from 'jotai'

function Lobby() {
  const [rounds, setRounds] = useState(1)
  const [timePerRound, setTimePerRound] = useState(60)
  const [players, setPlayers] = useState([])
  const [code, setCode] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const { id } = useParams()
  const player = useAtomValue(user)
  console.log("Atom: ", player);

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
          setCode(response.partyId);


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

  const updateGameSettings = async (rounds, timePerRound) => {
    try {
      const response = await databases.updateDocument(
        "672e683c001beba0b2a6",
        "678ad4ab0017e805fec9",
        id,
        {
          rounds,
          time_per_round: parseInt(timePerRound)
        }
      );
      console.log("Settings updated:", response);
    } catch (error) {
      console.error("Error updating game settings:", error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updateGameSettings(rounds, timePerRound);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [rounds, timePerRound]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  // console.log("Fetched players:", players);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='flex flex-col justify-center items-center w-full md:my-0 my-20 md:min-h-screen relative overflow-hidden px-4 sm:px-6'
    >
      <motion.h1
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-luckiest font-bold text-white mb-2 animate-pulse text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
      >
     {console.log(player) && player.isHost ? 'Party Lobby ' : 'Waiting for Host...'}

      </motion.h1>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-6xl mx-auto p-2 sm:p-4"
      >
        <div className={`bg-white/10 border-2 ${isCopied ? 'border-green-500' : 'border-white/20'} transition-colors duration-300 rounded-xl p-3 sm:p-4 mb-4`}>
          <h2 className="text-white  font-luckiest text-lg sm:text-xl mb-2">Party Code</h2>
          <div className={`bg-white/20 p-2 sm:p-3 rounded-lg text-white font-mono break-all text-sm sm:text-base flex justify-between items-center gap-2 ${isCopied ? 'bg-green-500/20' : ''}`}>
          <span className='font-bold text-xl'>{code} {isCopied && <span className="text-green-400 ml-2">Copied!</span>}</span>
          <Clipboard size={20} onClick={copyToClipboard} className="sm:w-6 cursor-pointer transition-all hover:text-orange-400 sm:h-6" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="bg-white/10 border-2 border-white/20 rounded-xl p-4 sm:p-6 h-full">
              <h2 className="text-white font-luckiest text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-3">
                <Settings size={24} className="sm:w-8 sm:h-8" />
                Game Settings
              </h2>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col text-white gap-3 sm:gap-4">
                  <label className="flex items-center gap-3 text-lg sm:text-xl font-semibold">
                    <div className="bg-white/5 p-3 rounded-lg">
                      Number of Rounds: <span className="text-orange-400">{rounds}</span>
                    </div>
                  </label>
                  {( player.isHost ? (
                    <input
                    type="range"
                    value={rounds}
                    onChange={(e) => {
                      const newRounds = Math.min(Math.max(Number(e.target.value), 1), 10);
                      setRounds(newRounds);
                    }}
                    className="w-full h-4 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:bg-orange-500 transition-all"
                    min="1"
                    max="10"
                    step="1"
                  />
                  ) : (
                    <div className="bg-white/10 border-2 font-extrabold border-white/20 rounded-lg p-1.5 sm:p-2 w-full text-center text-sm sm:text-base">
                    {rounds}
                  </div>
                  ))}
                </div>
                <div className="flex flex-col text-white gap-3 sm:gap-4">
                  <label className="flex items-center gap-3 text-lg sm:text-xl font-semibold">
                    <div className="bg-white/5 p-3 rounded-lg flex items-center gap-2">
                      <Clock size={20} className="sm:w-6 sm:h-6" />
                      Time per Round: <span className="text-orange-400">{timePerRound}</span> seconds
                    </div>
                  </label>
                  {( player.isHost ? (
                    <input
                    type="range"
                    value={timePerRound}
                    onChange={(e) => {
                      const newTime = Math.min(Math.max(Number(e.target.value), 10), 120);
                      setTimePerRound(newTime);
                    }}
                    className="w-full h-4 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:bg-orange-500 transition-all"
                    min="10"
                    max="120"
                    step="5"
                  />
                  ) : (
                    <div className="bg-white/10 border-2 font-extrabold border-white/20 rounded-lg p-1.5 sm:p-2 w-full text-center text-sm sm:text-base">
                    {timePerRound}
                  </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white/10 border-2 overflow-auto border-white/20 rounded-xl p-3 sm:p-4 h-[400px]">
              <h2 className="text-white font-luckiest text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
                <Users size={20} className="sm:w-6 sm:h-6" />
                Players ({players?.length || 0})
              </h2>
              <div className="space-y-2 h-[calc(100%-60px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {players.map((players, index) => {
                  const playerObj = JSON.parse(players);
                  return (
                    <div key={index} className={`flex items-center justify-between text-white p-1.5 sm:p-2 rounded-lg text-sm sm:text-base ${player.username === playerObj.username ? 'bg-green-500/20 font-bold' : 'bg-white/5 font-normal'}`}>
                      <div>
                      <span>#{index+1} </span>
                      <span className='text-white '>{playerObj.username} {player.username === playerObj.username && '(You)'}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">

                        {playerObj.isHost === "true" ? (
                          < Crown size={20} className="sm:w-6 text-yellow-500 sm:h-6" />
                        ) : (
                          ''
                        )}
                        <span className="text-orange-400">{playerObj.score || 0} pts</span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {( player.isHost && (<button
          className="w-full mt-3 sm:mt-4 p-3 sm:p-4 text-base sm:text-lg font-luckiest bg-orange-400 border-2 border-white/20 rounded-xl text-white hover:bg-green-500/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25"
        >
          <Play size={20} className="sm:w-6 sm:h-6" />
          Start Game
        </button>))}
      </motion.div>
    </motion.div>
  )
}

export default Lobby
