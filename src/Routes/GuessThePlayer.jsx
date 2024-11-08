import { useState, useEffect, useMemo } from 'react';
import Chessground from "@react-chess/chessground";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import "../style/chessgroundBaseOverride.css";
import "../style/chessgroundColorsOverride.css";
import "../style/pieces/staunty.css";
import PlayersPopup from '../components/PlayersPopup';

export default function GuessThePlayer({ fenList, details, loadPGN}){


    const [guess, setGuess] = useState('');
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
  
    const {
      whiteElo,
      blackElo,
      event,
      opening,
      result,
      termination: matchTermination,
      gameLink: gamelink,
  
    } = details;
  
    const averageElo = useMemo(() => Math.floor((whiteElo + blackElo) / 2), [whiteElo, blackElo]);
  
    const moveAudio =  new Audio("./sfx/move-self.mp3")
    const clickAudio =  new Audio("./sfx/click.mp3")
    const submmitAudio =  new Audio("./sfx/submit.mp3")
  
    const playMoveAudio = () => moveAudio.play();
    const playClickAudio = () => clickAudio.play();
    const playSubmitAudio = () => submmitAudio.play();
  
    useEffect(() => {
      setGuess('');
      setCurrentIndex(1);
      setIsResultVisible(false);
      setHasSubmitted(false);
    }, [fenList]);
  
    const nextMove = () => {
      if (currentIndex < fenList.length - 1) {
        playMoveAudio();
        setCurrentIndex(prev => prev + 1);
      }
    };
  
    const resultTranslation = ()=>{
        if (result == '1-0'){
          return `White ${matchTermination}`
        }
        if(result == '0-1'){
          return `Black ${matchTermination}`
        }
        if (result == '1/2-1/2'){
          return `Draw ${matchTermination || ''}`
        }
    }
  
    const previousMove = () => {
      if (currentIndex > 0) {
        playMoveAudio();
        setCurrentIndex(prev => prev - 1);
      }
    };
  
    const firstMove = () => {
      playClickAudio();
      setCurrentIndex(0);
    };
  
    const lastMove = () => {
      playClickAudio();
      setCurrentIndex(fenList.length - 1);
    };
  
    const submitGuess = () => {
      
        setIsResultVisible(true);

     
    };
  
    const closeResult = () => setIsResultVisible(false);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') nextMove();
        else if (event.key === 'ArrowLeft') previousMove();
        else if (event.key === 'Enter' && (guess || hasSubmitted)) submitGuess();
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [guess, currentIndex, fenList.length, hasSubmitted]);
  
    return (
      <div className="flex justify-center items-center">
        <div className="max-h-[90v] w-full lg:max-w-1xl md:max-w-xl sm:max-w-lg bg-[#161618] p-6 shadow-2xl rounded-2xl flex flex-col">
          {/* Chessboard Title */}
          <div className="flex justify-between gap-3 mb-4">
            <p className='bg-secnd rounded-lg w-full text-center text-white font-bold p-4 shadow-md hover:opacity-90'>Guess who's playing white ? </p>
           
          </div>
  
          {/* Chessboard */}
          <div className="aspect-square w-full h-full rounded-lg overflow-hidden shadow-lg">
            <Chessground width="100%" height="100%"
              config={{ fen: fenList[currentIndex] }}
            />
          </div>
  
          {/* Chessboard Navigation Controls */}
          <div className="flex-col justify-between items-center space-y-4 w-full mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className='flex gap-3'>
                <NavButton onClick={firstMove} icon={<ChevronsLeft size={32} />} />
                <NavButton onClick={previousMove} icon={<ChevronLeft size={32} />} />
                <NavButton onClick={nextMove} icon={<ChevronRight size={32} />} />
                <NavButton onClick={lastMove} icon={<ChevronsRight size={32} />} />
              </div>
  
              <div className='text-white font-bold bg-secnd p-4 text-center w-full rounded-lg shadow-md transition-all hover:bg-opacity-90'>
                {currentIndex == fenList.length -1 ?
                  <p className='text-white'>{resultTranslation()}</p> :
                  <p className='text-gray-400'>game result</p>
                }
              </div>
            </div>
  
            
          </div>
          <div className="flex p-2 mt-4  bg-secnd justify-between items-center rounded-lg overflow-hidden shadow-md">
      
            <button
              onClick={submitGuess}
              className={`${currentIndex < fenList.length-1 ? "bg-slate-500  active:transform-none hover:bg-slate-500 cursor-not-allowed opacity-50":'bg-accent'} font-bold w-full text-center rounded-lg flex items-center text-white px-6 py-3 hover:bg-gray-600 transform transition-all  active:scale-95`}
              disabled={currentIndex < fenList.length-1}            >
              Guess the player
            </button>
          </div>
        </div>
  
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="fixed left-4 bottom-4 font-bold bg-red-500 text-white p-4 rounded-lg shadow-xl z-50 backdrop-blur-sm"
            >
              Please enter your guess before submitting!
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Popup Component */}
        <PlayersPopup
          
          onClose={closeResult}
          isVisible={isResultVisible}
     
        />


     

      </div>

      
    );
  }
  
  const NavButton = ({ onClick, icon }) => (
    <button
      className="bg-secnd text-white p-3 rounded-lg hover:bg-gray-600 cursor-pointer transform transition-all hover:scale-105 active:scale-95 shadow-md"
      onClick={onClick}
    >
      {icon}
    </button>
  );
  

  



