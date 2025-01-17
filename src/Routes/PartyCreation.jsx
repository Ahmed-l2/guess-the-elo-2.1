import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, PartyPopper, User, Hash, Plus } from 'lucide-react'

function PartyCreation() {
  const [username, setUsername] = useState('')
  const [partyCode, setPartyCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)

  const handleJoinParty = () => {
    if (!partyCode) {
      setErrorMessage('Please enter a party code to join!')
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
      return
    }
    // Add your join party logic here
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className='flex flex-col justify-center items-center w-full min-h-[800px] relative overflow-hidden px-4'
    >
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {errorMessage}
        </motion.div>
      )}

      <motion.h1
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-5xl md:text-6xl font-luckiest lg:text-8xl font-bold text-white mb-10 animate-pulse text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
      >
        Join or Create a Party
      </motion.h1>
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mx-auto mt-2 md:mt-10 p-4 md:p-8"
      >
        <div className="flex flex-col gap-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={24} />
            <input
              type="text"
              placeholder="Choose Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 pl-12 text-lg rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
            />
          </div>
          
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={24} />
            <input
              type="text"
              placeholder="Enter Party Code"
              value={partyCode}
              onChange={(e) => setPartyCode(e.target.value)}
              className="w-full p-4 pl-12 text-lg rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
            />
          </div>
          
          <button 
            onClick={handleJoinParty}
            className="w-full p-4 text-lg font-luckiest bg-orange-400 border-2 border-white/20 rounded-xl text-white hover:bg-orange-400/80 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Users size={24} />
            Join Party
          </button>
          
          <div className="text-white text-center text-lg font-luckiest">- OR -</div>
          
          <Link
            to="/create-plus"
            className="w-full p-4 text-lg font-luckiest bg-green-500 border-2 border-white/20 rounded-xl text-white hover:bg-green-500/80 transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <Plus size={24} />
            Create New Pary
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PartyCreation