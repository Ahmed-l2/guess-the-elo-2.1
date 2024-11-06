import { useState, useEffect, useMemo } from 'react';
import Chessground from "@react-chess/chessground";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import Popup from './Popup';  // Import the Popup component

import "../style/chessgroundBaseOverride.css";
import "../style/chessgroundColorsOverride.css";
import "../style/chessground.cburnett.css";
import ResultPopup from './ResultPopup';

function Chessboard({ fenList, details }) {
  const [guess, setGuess] = useState('');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isResultVisible, setIsResultVisible] = useState(false);

  const {
    whiteElo,
    blackElo,
    event,
    result,
    opening,
    termination: matchTermination,
    gameLink: gamelink
  } = details;

  const averageElo = useMemo(() => Math.floor((whiteElo + blackElo) / 2), [whiteElo, blackElo]);

  const moveAudio = useMemo(() => new Audio("./sfx/move-self.mp3"), []);
  const clickAudio = useMemo(() => new Audio("./sfx/click.mp3"), []);

  const playMoveAudio = () => moveAudio.play();
  const playClickAudio = () => clickAudio.play();

  const nextMove = () => {
    if (currentIndex < fenList.length - 1) {
      playMoveAudio();
      setCurrentIndex(prev => prev + 1);
    }
  };

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
      else if (event.key === 'Enter' && guess) submitGuess();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guess, currentIndex, fenList.length]);

  return (
    <div className="flex justify-center items-center">
      <div className="max-h-[90v] w-full lg:max-w-2xl md:max-w-xl p-2 border-2 border-black bg-gray-900 rounded-2xl flex flex-col">
        {/* Chessboard Title */}
        <div className="flex justify-between gap-2 text-center">
          <GameTitle label={event} />
          <GameTitle label={opening} />
        </div>

        {/* Chessboard */}
        <div className="aspect-square w-full h-full">
          <Chessground width="100%" height="100%"
            config={{ fen: fenList[currentIndex] }}
          />
        </div>

        {/* Chessboard Navigation Controls */}
        <div className="flex-col justify-between items-center space-y-2 w-full mt-2">
          <div className="flex gap-2">
            <NavButton onClick={firstMove} icon={<ChevronsLeft size={40} />} />
            <NavButton onClick={previousMove} icon={<ChevronLeft size={40} />} />
            <NavButton onClick={nextMove} icon={<ChevronRight size={40} />} />
            <NavButton onClick={lastMove} icon={<ChevronsRight size={40} />} />
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
        result={result}
        gamelink={gamelink}
        termination={matchTermination}
        onClose={closeResult}
        isVisible={isResultVisible}
      />
    </div>
  );
}

const GameTitle = ({ label }) => (
  <div className="flex items-center justify-center p-2 text-sm sm:text-base md:text-lg bg-gray-700 font-bold w-full text-white rounded-md mb-2 line-clamp-1">
    {label}
  </div>
);

const NavButton = ({ onClick, icon }) => (
  <button
    className="bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 cursor-pointer"
    onClick={onClick}
  >
    {icon}
  </button>
);

const GuessInput = ({ guess, setGuess, onSubmit }) => (
  <div className="flex gap-4 h-10 bg-gray-700 justify-between items-center rounded-md overflow-hidden">
    <input
      type="text"
      value={guess}
      onChange={(e) => setGuess(e.target.value)}
      placeholder="Enter Your Guess..."
      className="flex-1 pl-4 text-gray-300 bg-transparent focus:outline-none"
    />
    <button
      onClick={onSubmit}
      className="bg-gray-500 h-full flex items-center text-white px-4 hover:bg-gray-600"
    >
      Submit
    </button>
  </div>
);

export default Chessboard;
