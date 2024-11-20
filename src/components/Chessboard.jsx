import { useState, useEffect, useMemo } from 'react';
import Chessground from "@react-chess/chessground";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import Popup from './Popup';  // Import the Popup component
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGameDetails, fetchRandomGame } from '../lib/appwrite';
import goatSound from '/sfx/goat.mp3'
import "../style/chessgroundBaseOverride.css";
import "../style/chessgroundColorsOverride.css";
import "../style/pieces/staunty.css";
import ResultPopup from './ResultPopup';


function Chessboard() {
  const [fenList, setFenList] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const [guess, setGuess] = useState('');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [average, setAverage] = useState('');
  const [wElo, setWElo] = useState('');
  const [bElo, setBElo] = useState('');
  const [gamelink, setGameLink] = useState('');

  const {
    $id: id = null,
    event = '',
    opening = '',
    result = '',
    termination: matchTermination = '',
  } = gameDetails || {};

  const getRandomGame = async () => {
    setIsLoading(true);
    const data = await fetchRandomGame(); // Fetching data from Appwrite
    setFenList(data.fenList);  // Extract fenList
    setGameDetails(data);      // Set other game details
    setIsLoading(false);
  };

  useEffect(() => {
    getRandomGame();
  }, []);

  const moveAudio =  new Audio("./sfx/move-self.mp3")
  const clickAudio =  new Audio("./sfx/click.mp3")
  const submmitAudio =  new Audio("./sfx/submit.mp3")
  const goatAudio = new Audio(goatSound)

  const playMoveAudio = () => moveAudio.play();
  const playClickAudio = () => clickAudio.play();
  const playSubmitAudio = () => submmitAudio.play();
  const playGoatAudio =  () => goatAudio.play();

  useEffect(() => {
    setGuess('');
    setCurrentIndex(1);
    setIsResultVisible(false);
    setHasSubmitted(false);
    setAverage('');
    setWElo('');
    setBElo('');
    setGameLink('');
  }, [fenList]);

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (fenList[currentIndex]) {
        try {
          const response = await fetch(`https://stockfish.online/api/stockfish.php?fen=${fenList[currentIndex]}&depth=12&mode=eval`);
          const data = await response.json();
          const evalMatch = data.data.match(/Total evaluation: ([-\d.]+)/);
          const evalValue = evalMatch ? parseFloat(evalMatch[1]) : null;
          setEvaluation(evalValue);
        } catch (error) {
          console.error('Error fetching evaluation:', error);
        }
      }
    };

    fetchEvaluation();
  }, [fenList, currentIndex]);


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

  const gameMode = () =>{
     if(event === "Blitz Game"){
      return 'bg-[#e3aa24] text-white'

     }else if(event === "Bullet Game"){
      return 'bg-[#fad541]'


     }else if(event === "Rapid Game"){
      return 'bg-[#8bc051] text-white'
     }else if(event === "Classical Game"){
      return 'bg-[#473a9f] text-white'
     }else if(event === "Ultra Bullet Game"){
      return 'bg-[#fff242] '
     }else {return 'bg-secnd text-white'}
  }

  const eventTranslation = () =>{
    if(event === "Blitz Game"){
     return 'BLITZ '
    }else if(event === "Bullet Game"){
     return 'BULLET'
    }else if(event === "Rapid Game"){
     return 'RAPID'
    }else if(event === "Classical Game"){
     return 'CLASSICAL'
    }else if(event === "Ultra Bullet Game"){
     return 'ULTRA BULLET'
    }
 }

 const evalTranslation = () =>{
      if (evaluation > 0) return "text-black"
      else if (evaluation < 0) return "text-white"
 }

  const getEvalBarHeight = () => {
    if (!evaluation ) return '0%';
    const normalizedEval = Math.max(Math.min(evaluation, 5), -5);
    const percentage = (1 - ((normalizedEval + 5) / 10)) * 100;
    return `${percentage}%`;
  };

  const submitGuess = async () => {
    if (guess && !hasSubmitted) {
      playSubmitAudio();
      setIsLoading(true);
      try {
        if (id) {
          const results = await fetchGameDetails(id);
          setAverage(results.averageElo);
          setWElo(results.whiteElo);
          setBElo(results.blackElo);
          setGameLink(results.gameLink);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      }

      setIsResultVisible(true);
      setHasSubmitted(true);
    } else if (hasSubmitted) {
      setIsResultVisible(true);
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
    setIsLoading(false);
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
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* <div className="w-8 h-96 bg-white rounded  relative mr-2 overflow-hidden">
        <div
          className="absolute bottom-0 w-full bg-black   transition-all duration-300 ease-in-out"
          style={{ height: getEvalBarHeight() }}
        />
        <div className={`absolute w-full text-xs z-50  ${evalTranslation()}  font-bold text-center`} style={{ top: '50%', transform: 'translateY(-50%)' }}>
          {evaluation ? evaluation.toFixed(1) : 'M'}
        </div>
      </div> */}
      <div className="max-h-[90v] w-full lg:max-w-2xl lg:py-4  md:max-w-xl sm:max-w-lg bg-[#161618] p-3 sm:p-6 shadow-2xl  sm:rounded-2xl flex flex-col">
        {/* Chessboard Title */}

        <div className="flex justify-between gap-2 sm:gap-3 mb-2 sm:mb-4">
          <p className={`${gameMode()} rounded-lg w-1/3   font-bold text-center p-2 sm:p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate `} > {eventTranslation() || "game type"}</p>
          <p className='bg-secnd rounded-lg w-full text-white font-bold text-center p-2 sm:p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate hover:whitespace-normal hover:overflow-visible' > {opening || "Opening name"}</p>

        </div>


        {/* Chessboard */}
        <div className="aspect-square w-full h-full rounded-lg overflow-hidden shadow-lg">
          <Chessground width="100%" height="100%"
            config={{ fen: fenList[currentIndex] }}
          />
        </div>

        {/* Chessboard Navigation Controls */}
        <div className="flex-col justify-between items-center space-y-2 sm:space-y-4 w-full mt-2 sm:mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <div className='flex gap-1 sm:gap-1 w-full'>
              <NavButton onClick={firstMove} icon={<ChevronsLeft size={24} className="sm:w-8 sm:h-8" />} />
              <NavButton onClick={previousMove} icon={<ChevronLeft size={24} className="sm:w-8 sm:h-8" />} />
              <NavButton onClick={nextMove} icon={<ChevronRight size={24} className="sm:w-8 sm:h-8" />} />
              <NavButton onClick={lastMove} icon={<ChevronsRight size={24} className="sm:w-8 sm:h-8" />} />
            </div>
            <p className='bg-secnd rounded-lg w-1/3 text-white font-bold text-center p-4 sm:p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate hidden sm:block' > {`Move ${currentIndex}` || "Moves"}</p>
            <div className='text-white font-bold truncate w-full sm:grow bg-secnd p-4 sm:p-4 text-center text-xs sm:text-base rounded-lg shadow-md transition-all hover:bg-opacity-90  sm:mt-0'>
              {currentIndex == fenList.length -1 ?
                <p className='text-white'>{resultTranslation()}</p> :
                <p className='text-gray-400'>Game Results</p>
              }

            </div>

          </div>

          <GuessInput guess={guess} setGuess={setGuess} onSubmit={submitGuess} disabled={hasSubmitted} />
        </div>
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed left-4 bottom-4 font-bold bg-red-500 text-white p-3 sm:p-4 text-sm sm:text-base rounded-lg shadow-xl z-50 backdrop-blur-sm"
          >
            Please enter your guess before submitting!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Component */}
      <ResultPopup
        wElo={wElo}
        bElo={bElo}
        result={result}
        gamelink={gamelink}
        average={average}
        guess={guess}
        title={event}
        termination={matchTermination}
        onClose={closeResult}
        isVisible={isResultVisible}
        loadPGN={getRandomGame}
      />
    </div>
  );
}

const NavButton = ({ onClick, icon }) => (
  <button
    className="bg-secnd grow text-center text-white p-3 rounded-lg hover:bg-gray-600 cursor-pointer transform transition-all hover:scale-105 active:scale-95 shadow-md"
    onClick={onClick}
  >
    {icon}
  </button>
);

const GuessInput = ({ guess, setGuess, onSubmit, disabled }) => (
  <div className="flex p-1 bg-secnd justify-between items-center rounded-lg overflow-hidden shadow-md">
    <input
      type="number"
      value={guess}
      onChange={(e) => setGuess(e.target.value)}
      placeholder="Enter Your Guess..."
      className="flex-1 font-bold appearance-none w-full text-white bg-transparent focus:outline-none px-3 py-2"
      disabled={disabled}
    />
    <button
      onClick={onSubmit}
      className="bg-accent font-bold rounded-lg flex items-center text-white px-6 py-3 hover:bg-gray-600 transform transition-all hover:scale-105 active:scale-95"
    >
      {disabled ? 'Show Result' : 'Submit'}
    </button>
  </div>
);

export default Chessboard;
