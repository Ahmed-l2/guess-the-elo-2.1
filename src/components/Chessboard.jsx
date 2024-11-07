import { useState, useEffect, useMemo } from 'react';
import Chessground from "@react-chess/chessground";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import Popup from './Popup';  // Import the Popup component

import "../style/chessgroundBaseOverride.css";
import "../style/chessgroundColorsOverride.css";
import "../style/pieces/staunty.css";
import ResultPopup from './ResultPopup';

function Chessboard({ fenList, details }) {
  const [guess, setGuess] = useState('');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const {
    whiteElo,
    blackElo,
    event,
    opening,
    result,
    termination: matchTermination,
    gameLink: gamelink
  } = details;

  const averageElo = useMemo(() => Math.floor((whiteElo + blackElo) / 2), [whiteElo, blackElo]);

  const moveAudio = useMemo(() => new Audio("./sfx/move-self.mp3"), []);
  const clickAudio = useMemo(() => new Audio("./sfx/click.mp3"), []);
  const submmitAudio = useMemo(() => new Audio("./sfx/submit.mp3"), []);

  const playMoveAudio = () => moveAudio.play();
  const playClickAudio = () => clickAudio.play();
  const playSubmitAudio = () => submmitAudio.play();

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
    playSubmitAudio();
    setCurrentIndex(0);
  };

  const lastMove = () => {
    playClickAudio();
    setCurrentIndex(fenList.length - 1);
  };

  const submitGuess = () => {
    if(guess){
      playSubmitAudio();
      setIsResultVisible(true);
    }
  };

  const closeResult = () => setIsResultVisible(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') nextMove();
      else if (event.key === 'ArrowLeft') previousMove();
      else if (event.key === 'Enter' && guess) submitGuess();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guess, currentIndex, fenList.length]);

  return (
    <div className="flex justify-center items-center ">
      <div className="max-h-[90v] w-full lg:max-w-1xl md:max-w-xl bg-[#161618] p-3   rounded-2xl flex flex-col">
        {/* Chessboard Title */}
        <div className="flex justify-between gap-2 mb-2 text-center">
          <p className='bg-secnd rounded w-1/3 text-white font-bold text-center p-4' > {event || "game type"}</p>
          <p className='bg-secnd rounded w-full text-white font-bold text-center p-4' > {opening || "Opening name"}</p>
        </div>

        {/* Chessboard */}
        <div className="aspect-square w-full h-full">
          <Chessground width="100%" height="100%"
            config={{ fen: fenList[currentIndex] }}
          />
        </div>

        {/* Chessboard Navigation Controls */}
        <div className="flex-col justify-between items-center space-y-2 w-full mt-2">
          <div className="flex  items-center justify-between gap-2">
            <div className='flex gap-2'>
            <NavButton onClick={firstMove} icon={<ChevronsLeft size={40} />} />
            <NavButton onClick={previousMove} icon={<ChevronLeft size={40} />} />
            <NavButton onClick={nextMove} icon={<ChevronRight size={40} />} />
            <NavButton onClick={lastMove} icon={<ChevronsRight size={40} />} />
            </div>

            <div className='text-white font-bold bg-secnd p-4 text-center w-full rounded'>{currentIndex == fenList.length -1 ?  <p className='text-white'>{resultTranslation()}</p> : <p className='text-gray-400'>game result</p>}</div>
          </div>

          <GuessInput guess={guess} setGuess={setGuess} onSubmit={submitGuess} />





        </div>
      </div>

      {/* Popup Component */}
      <ResultPopup
        guess={guess}
        average={averageElo}
        wElo={whiteElo}
        bElo={blackElo}
        title={event}
        gamelink={gamelink}
        termination={matchTermination}
        onClose={closeResult}
        isVisible={isResultVisible}
      />
    </div>
  );
}


const NavButton = ({ onClick, icon }) => (
  <button
    className="bg-secnd text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer"
    onClick={onClick}
  >
    {icon}
  </button>
);

const GuessInput = ({ guess, setGuess, onSubmit }) => (
  <div className="flex  p-1 bg-secnd justify-between items-center rounded-md overflow-hidden">
    <input
      type="number"
      value={guess}
      onChange={(e) => setGuess(e.target.value)}
      placeholder="Enter Your Guess..."
      className="flex-1 font-bold appearance-none w-full text-white bg-transparent focus:outline-none"
    />
    <button
      onClick={onSubmit}
      className="bg-accent font-bold rounded-md  flex items-center text-white p-3 hover:bg-gray-600"
    >
      Submit
    </button>


  </div>
);

export default Chessboard;
