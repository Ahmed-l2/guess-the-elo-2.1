import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Logo from '/logo.png'
import { motion } from 'framer-motion';

import wte from '/bgs/wtecard.jpg'

import wtp from '/bgs/gtpcard.png'

export default function Landing(){
    return(
      <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className='flex flex-col justify-center  items-center w-full min-h-[800px] relative overflow-hidden px-4'
      >
     
        
        <motion.h1 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}

          className="text-5xl md:text-6xl font-luckiest lg:text-8xl font-bold text-white mb-10 animate-pulse text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
        >
          What's The ELO!
        </motion.h1>
        
        
        
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mx-auto mt-2 md:mt-10 p-4 md:p-8"
        >
          <div className="flex flex-col md:flex-row justify-center z-50 items-center gap-8">
            <Link 
              to="/WTE"
              className="relative text-white p-8 filter grayscale-10 hover:filter-none rounded-2xl text-2xl md:text-3xl transition-all duration-300 shadow-xl w-full md:w-96 h-48 md:h-64 overflow-hidden group hover:scale-105"
              style={{ backgroundImage: `url(${wte})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black/50 group-hover:backdrop-blur-xl transition-all duration-300"></div>
              <motion.div className="relative font-luckiest z-10 flex items-center justify-center h-full  tracking-wider">
                What's The ELO!
              </motion.div>
            </Link>

            <div 
              className="relative text-white filter grayscale p-8 rounded-2xl text-2xl md:text-3xl transition-all duration-300 shadow-xl w-full md:w-96 h-48 md:h-64 overflow-hidden group cursor-not-allowed opacity-70"
              style={{ backgroundImage: `url(${wtp})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-lg transition-all duration-300"></div>
              <motion.div className="relative font-luckiest z-10 flex flex-col items-center justify-center h-full  tracking-wider">
                <span>Guess The Player</span>
                <span className="text-base md:text-lg mt-2 font-extralight">Coming Soon...</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </>
    )
  }