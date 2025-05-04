import React, { useEffect, useState, useRef } from 'react';
import Chessground from '@react-chess/chessground';
import { useNavigate, useParams } from 'react-router-dom';
import { client, databases } from '../lib/appwrite';
import { useAtomValue } from 'jotai';
import { user } from "../GlobalContext/atoms"
import "../style/chessgroundBaseOverride.css";
import "../style/chessgroundColorsOverride.css";
import '../style/pieces/maestro.css';
import '../style/App.css';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const GuessInput = ({ guess, setGuess, onSubmit, disabled }) => (
  <div className="flex p-1 bg-secnd justify-between items-center rounded-lg overflow-hidden shadow-md">
    <input
      type="number"
      value={guess}
      onChange={setGuess}
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

const MultiplayerChessboard = () => {
  const navigate = useNavigate();
  const [fenList, setFenList] = useState([]);
  const [gameDetails, setGameDetails] = useState({});
  const [guess, setGuess] = useState('');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [boardSize, setBoardSize] = useState(750);
  const [roundTimer, setRoundTimer] = useState(0);
  const [playerScores, setPlayerScores] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, results, finished
  const [roundResults, setRoundResults] = useState([]);

  const { id: partyId } = useParams();
  const playerData = useAtomValue(user);
  const boardContainerRef = useRef(null);
  const timerRef = useRef(null);

  // Audio elements
  const moveAudio = new Audio("../sfx/move-self.mp3");
  const clickAudio = new Audio("../sfx/click.mp3");
  const submmitAudio = new Audio("../sfx/submit.mp3");
  const goatAudio = new Audio("../sfx/goat.mp3");

  // Load initial party data and set up realtime subscription
  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await databases.getDocument(
          "672e683c001beba0b2a6",
          "678ad4ab0017e805fec9",
          partyId
        );

        setTotalRounds(response.rounds);
        setCurrentRound(response.CurrentRound);

        // Access the first game in the queue
        if (response.gameQueue && response.gameQueue.length > 0) {
          const currentGame = JSON.parse(response.gameQueue[0]);
          setFenList(currentGame.fenList);
          setGameDetails(currentGame);
        }

        // Parse player scores
        const parsedPlayers = response.players.map(player => JSON.parse(player));
        setPlayerScores(parsedPlayers);

        setGameState(response.gameState);
      } catch (error) {
        console.error("Error fetching party data:", error);
      }
    };

    fetchPartyData();

    // Set up realtime subscription
    const unsubscribe = client.subscribe(
      `databases.672e683c001beba0b2a6.collections.678ad4ab0017e805fec9.documents.${partyId}`,
      (response) => {
        try {
          if (response.payload) {
            const data = response.payload;
            console.log("Parsed realtime data:", data);

            // Update game state if changed
            if (data.gameState !== gameState) {
              setGameState(data.gameState);
            }

            // if (gameState === 'lobby') {
            //   navigate(`/lobby/${partyId}`);
            // }

            // Update current round
            if (data.CurrentRound !== currentRound) {
              setCurrentRound(data.CurrentRound);
            }

            // Update game queue/current game
            if (data.gameQueue && data.gameQueue.length > 0) {
              const currentGame = JSON.parse(data.gameQueue[0]);
              if (currentGame) {
                setFenList(currentGame.fenList);
                setGameDetails(currentGame);
              }
            }

            // Update player scores
            if (data.players) {
              const parsedPlayers = data.players.map(player => JSON.parse(player));
              setPlayerScores(parsedPlayers);
            }

            // Update round results if available
            if (data.roundResults) {
              setRoundResults(data.roundResults || []);
            }
          }
        } catch (error) {
          console.error("Error in realtime callback:", error);
        }
      }
    );

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [partyId]);

  // Start round timer when game state changes to playing
  useEffect(() => {
      if (gameState === 'lobby') {
        navigate(`/lobby/${partyId}`);
      }

      if (gameState === 'playing' && !hasSubmitted) {
      const fetchTimePerRound = async () => {
        try {
          const response = await databases.getDocument(
            "672e683c001beba0b2a6",
            "678ad4ab0017e805fec9",
            partyId
          );

          setRoundTimer(response.time_per_round);

          // Start the countdown timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          timerRef.current = setInterval(() => {
            setRoundTimer(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current);
                // Auto submit if time runs out
                if (!hasSubmitted) {
                  submitGuess(true);
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (error) {
          console.error("Error fetching time per round:", error);
        }
      };

      fetchTimePerRound();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, hasSubmitted, partyId]);

  // Board sizing
  useEffect(() => {
    const updateBoardSize = () => {
      const width = window.innerWidth;
      let size = width <= 770 ? 700 : 750;
      setBoardSize(size);
      if (boardContainerRef.current) {
        boardContainerRef.current.style.setProperty('--cg-width', `${size}px`);
        boardContainerRef.current.style.setProperty('--cg-height', `${size}px`);
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);

    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    setGuess(e.target.value);
    const submitButton = document.getElementById('sub_guess');
    if (submitButton) {
      if (e.target.value) {
        submitButton.style = 'background-color:var(--button-color);color:white';
      } else {
        submitButton.style = 'background-color:#4d4d4d;color:silver;';
      }
    }
  };

  // Submit guess function
  const submitGuess = async (timeout = false) => {
    try {
    if (!guess && !timeout) return;
    console.log("🎮 Starting guess submission process...", guess);

    new Audio("../sfx/click.mp3").play();

    try {
      // Get player from scores
      console.log("🔍 Looking for player in scores...");
      const player = playerScores.find(p => p.id === playerData.userId);
      console.log(playerScores)
      console.log(playerData)
      console.log(player)
      if (!player) return;

      // Calculate score based on guess accuracy
      console.log("🧮 Calculating score based on guess accuracy...");
      let score = 0;
      const userGuess = parseInt(guess) || 0;
      const actualElo = Math.floor((gameDetails.whiteElo + gameDetails.blackElo) / 2);

      if (!timeout) {
        // Calculate score based on accuracy (similar to your existing logic)
        const diff = Math.abs(userGuess - actualElo);
        if (diff === 0) score = 100; // Perfect guess
        else if (diff <= 10) score = 90;
        else if (diff <= 50) score = 70;
        else if (diff <= 100) score = 50;
        else if (diff <= 200) score = 30;
        else score = 10;
      }

      console.log("📊 Score calculated:", score);

      // Update player's score in database
      console.log("💾 Updating player scores in memory...");
      const playerIndex = playerScores.findIndex(p => p.id === playerData.userId);
      if (playerIndex !== -1) {
        const updatedPlayers = [...playerScores];
        updatedPlayers[playerIndex] = {
          ...player,
          score: (parseInt(player.score) + score).toString(),
          lastGuess: userGuess.toString()
        };

        console.log("🔄 Fetching current database state...");
        // Get all players from database to ensure we don't overwrite other changes
        const response = await databases.getDocument(
          "672e683c001beba0b2a6",
          "678ad4ab0017e805fec9",
          partyId
        );

        const allPlayers = response.players.map(p => JSON.parse(p));
        const updatedAllPlayers = allPlayers.map(p => {
          if (p.id === playerData.userId) {
            return {
              ...p,
              score: (parseInt(p.score) + score).toString(),
              lastGuess: userGuess.toString()
            };
          }
          return p;
        });

        console.log("📤 Updating database with new scores...");
        // Update the database with the new player data
        await databases.updateDocument(
          "672e683c001beba0b2a6",
          "678ad4ab0017e805fec9",
          partyId,
          {
            players: updatedAllPlayers.map(p => JSON.stringify(p)),
            playerGuesses: [...response.playerGuesses, JSON.stringify({
              playerId: playerData.userId,
              guess: userGuess,
              round: currentRound
            })],
          }
        );
      }

      console.log("✅ Setting submission state...");
      setHasSubmitted(true);

      // Disable input and submit button
      console.log("🔒 Disabling input controls...");
      const guessInput = document.getElementById('guess_inp');
      const submitButton = document.getElementById('sub_guess');
      if (guessInput) guessInput.disabled = true;
      if (submitButton) submitButton.disabled = true;

      console.log("🎯 Showing game details...");
      // Show game details like in single player
      showGameDetails(userGuess);

    } catch (error) {
      console.error("❌ Error submitting guess:", error);
    }
  } catch (error) {
    console.error("Full error details:", {
      error,
      message: error.message,
      stack: error.stack,
      guessValue: guess,
      hasSubmitted,
      gameState
    });
    // Optionally show an error to the user
  }
  };

  // Show game details after submitting
  const showGameDetails = (userGuess) => {
    const w_elo = document.getElementById('w_elo');
    const b_elo = document.getElementById('b_elo');
    const g_avrg = document.getElementById('g_avrg');
    const g_res = document.getElementById('g_res');
    const op_name = document.getElementById('op_name');
    const result_info = document.getElementById('result_info');

    if (w_elo) w_elo.innerHTML = gameDetails.whiteElo;
    if (b_elo) b_elo.innerHTML = gameDetails.blackElo;

    const averageElo = Math.floor((gameDetails.whiteElo + gameDetails.blackElo) / 2);
    if (g_avrg) {
      g_avrg.innerHTML = averageElo.toString();
      g_avrg.style = 'border:5px solid white';
    }

    if (g_res) {
      g_res.style = 'color:silver;background-color:#4d4d4d;';
      if (gameDetails.result === '1-0') {
        g_res.innerHTML = gameDetails.termination === "Time forfeit"
          ? 'White won by timeout'
          : `White ${gameDetails.termination}`;
      } else if (gameDetails.result === '0-1') {
        g_res.innerHTML = gameDetails.termination === "Time forfeit"
          ? 'Black won by timeout'
          : `Black ${gameDetails.termination}`;
      } else if (gameDetails.result === '1/2-1/2') {
        g_res.innerHTML = 'Draw';
      }
    }

    if (op_name) {
      op_name.style = 'color:silver;background-color:#4d4d4d;';
    }

    // Set the game link
    const g_link = document.getElementById('g_link');
    if (g_link && gameDetails.gameLink) {
      g_link.href = gameDetails.gameLink;
      g_link.style = 'color:white;background-color:#8ec24e;';
    }

    // Show feedback on guess accuracy
    if (result_info && userGuess) {
      const diff = Math.abs(userGuess - averageElo);

      if (diff === 0) {
        result_info.innerHTML = "GOAT GUESS";
        if (g_avrg) g_avrg.style = "background-color:#fff;color:black";
        goatAudio.play();
        result_info.style = "color:white;background-size:cover;background-image:url('https://media1.tenor.com/m/3NxNq1agx5EAAAAd/hikaru-chess.gif');-webkit-text-stroke: 3px gold;text-shadow:1px 1px 20px white";
        const boxB = document.getElementById('box-b');
        if (boxB) boxB.style = 'transition:10s;transform:rotate(360deg)';
      } else if (diff <= 10) {
        result_info.innerHTML = "Wait ! Are you cheating ?";
        result_info.style = "color:white;background-color:#81ecec;";
        if (g_avrg) g_avrg.style = 'background-color:#81ecec;color:white';
      } else if (diff <= 50) {
        result_info.innerHTML = "Wow, you're almost there!";
        result_info.style = 'color:white;background-color:#63cdda;';
        if (g_avrg) g_avrg.style = 'background-color:#63cdda;color:white';
      } else if (diff <= 100) {
        result_info.innerHTML = 'Good guess !';
        result_info.style = 'color:white;background-color:#74b9ff';
        if (g_avrg) g_avrg.style = 'background-color:#74b9ff;color:white';
      } else {
        result_info.innerHTML = "Your guess is a bit off";
        result_info.style = 'color:white;background-color:#b33939';
        if (g_avrg) g_avrg.style = 'background-color:#b33939;color:white;';
      }
    }
  };

  // Board navigation functions
  const incrementIndex = () => {
    if (currentIndex !== fenList.length - 1) {
      moveAudio.play();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % fenList.length);
      const nextMoveBtn = document.getElementById('next-move');
      if (nextMoveBtn) nextMoveBtn.blur();
    }
  };

  const decrementIndex = () => {
    if (currentIndex !== 0) {
      moveAudio.play();
      setCurrentIndex((prevIndex) => (prevIndex - 1 + fenList.length) % fenList.length);
      const prevMoveBtn = document.getElementById('prev-move');
      if (prevMoveBtn) prevMoveBtn.blur();
    }
  };

  const goToFirst = () => {
    clickAudio.play();
    setCurrentIndex(0);
  };

  const goToLast = () => {
    clickAudio.play();
    setCurrentIndex(fenList.length - 1);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        incrementIndex();
      } else if (event.key === 'ArrowLeft') {
        decrementIndex();
      } else if (event.key === 'Enter' && guess && !hasSubmitted && gameState === 'playing') {
        submitGuess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, fenList.length, guess, hasSubmitted, gameState]);

  // Render scoreboard
  const renderScoreboard = () => {
    // Sort players by score (highest first)
    const sortedPlayers = [...playerScores].sort((a, b) =>
      parseInt(b.score) - parseInt(a.score)
    );

    return (
      <div className='bg-secnd rounded-lg p-4'>
        <p className='hidden sm:block bg-secnd rounded-lg w-full text-white font-bold text-center mb-4 text-xs sm:text-base hover:bg-opacity-90 transition-all truncate'>Leaderboard</p>
        <div>
          {sortedPlayers.map((player, index) => (
            <div
              key={`${player.id}-${index}`}
              className={`flex justify-between bg-[#343540] p-2 rounded-lg text-white mb-2 ${player.id === playerData.userId ? 'current-player' : ''}`}
            >
              <span>{index + 1}</span>
              <span className='font-bold'>{player.username}</span>
              <span>{player.score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render round info
  const renderRoundInfo = () => {
    return (
      <div className=''>
        {gameState === 'playing' && (
          <div className={`flex text-white items-center justify-center text-2xl font-bold p-2 rounded-lg min-w-[4rem] ${
            roundTimer <= 10
              ? 'animate-pulse bg-red-600'
              : 'bg-secnd'
          }`}>
            {roundTimer}s
          </div>
        )}
      </div>
    );
  };

  // Render waiting for players or between rounds screen
  const renderWaitingScreen = () => {
    if (gameState === 'waiting') {
      return (
        <div className="waiting-screen">
          <h2>Waiting for game to start...</h2>
          <p>The host will start the game when everyone is ready.</p>
        </div>
      );
    } else if (gameState === 'results') {
      return (
        <div className="round-results-screen">
          <h2>Round {currentRound} Results</h2>
          <div className="results-container">
            {roundResults.map((result, index) => (
              <div key={`result-${index}-${result.username}`} className="player-result">
                <span className="player-name">{result.username}</span>
                <span className="player-guess">Guessed: {result.lastGuess || 'No guess'}</span>
                <span className="player-points">+{result.roundScore} points</span>
              </div>
            ))}
          </div>
          <p>Waiting for the next round to start...</p>
        </div>
      );
    } else if (gameState === 'finished') {
      return (
        <div className="game-finished-screen">
          <h2>Game Finished!</h2>
          <div className="final-results">
            <h3>Final Standings</h3>
            {renderScoreboard()}
          </div>
        </div>
      );
    }

    return null;
  };

  const resultTranslation = () => {
    if (gameDetails.result == '1-0'){
      return `White ${gameDetails.termination}`
    }
    if(gameDetails.result == '0-1'){
      return `Black ${gameDetails.termination}`
    }
    if (gameDetails.result == '1/2-1/2'){
      return `Draw ${gameDetails.termination || ''}`
    }
  };

  const moveToNextRound = async () => {
    try {
      const response = await databases.getDocument(
        "672e683c001beba0b2a6",
        "678ad4ab0017e805fec9",
        partyId
      );

      // Create a new array without the first game
      const updatedGameQueue = [...response.gameQueue.slice(1)];

      await databases.updateDocument(
        "672e683c001beba0b2a6",
        "678ad4ab0017e805fec9",
        partyId,
        {
          status: "playing",
          CurrentRound: response.CurrentRound + 1,
          gameQueue: updatedGameQueue
        }
      );
    } catch (error) {
      console.error("Error moving to next round:", error);
    }
  };

  const gameMode = () =>{
    if(gameDetails.event === "Blitz Game"){
     return 'bg-[#e3aa24] text-white'

    }else if(gameDetails.event === "Bullet Game"){
     return 'bg-[#fad541]'


    }else if(gameDetails.event === "Rapid Game"){
     return 'bg-[#8bc051] text-white'
    }else if(gameDetails.event === "Classical Game"){
     return 'bg-[#473a9f] text-white'
    }else if(gameDetails.event === "Ultra Bullet Game"){
     return 'bg-[#fff242] '
    }else {return 'bg-secnd text-white'}
 }

 const eventTranslation = () =>{
    if(gameDetails.event === "Blitz Game"){
    return 'BLITZ '
    }else if(gameDetails.event === "Bullet Game"){
    return 'BULLET'
    }else if(gameDetails.event === "Rapid Game"){
    return 'RAPID'
    }else if(gameDetails.event === "Classical Game"){
    return 'CLASSICAL'
    }else if(gameDetails.event === "Ultra Bullet Game"){
    return 'ULTRA BULLET'
    }
  }

  const NavButton = ({ onClick, icon }) => (
    <button
      className="bg-secnd grow text-center text-white p-3 rounded-lg hover:bg-gray-600 cursor-pointer transform transition-all hover:scale-105 active:scale-95 shadow-md"
      onClick={onClick}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex-col justify-center items-center mt-20">
      {gameState === 'playing' ? (
        <div className="max-h-[90v] w-full lg:max-w-6xl lg:py-4 md:max-w-5xl sm:max-w-3xl bg-[#161618] p-3 sm:p-6 shadow-2xl sm:rounded-2xl flex flex-col mx-auto">

          {/* Chessboard Title */}
        <div className="flex justify-between items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <p className={`${gameMode()} rounded-lg w-1/3 font-bold text-center p-2 sm:p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate `} > {eventTranslation() || "game type"}</p>
          <p className='bg-secnd rounded-lg w-full text-white font-bold text-center p-2 sm:p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate hover:whitespace-normal hover:overflow-visible' > {gameDetails.opening || "Opening name"}</p>
          <p className={`bg-secnd text-white rounded-lg w-1/3 font-bold text-center p-2 sm:p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate `} > Round {currentRound} of {totalRounds}</p>
          {renderRoundInfo()}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Chessboard */}
          <div className="w-full sm:w-2/3 aspect-square rounded-lg overflow-hidden shadow-lg">
            <Chessground width="100%" height="100%"
              config={{ fen: fenList[currentIndex] }}
            />
          </div>

          {/* Game Details */}
          <div className="w-full sm:w-1/3 flex flex-col justify-between">
            <div className='flex flex-col gap-3'>
              <div className='flex flex-row gap-1'>
                <NavButton onClick={goToFirst} icon={<ChevronsLeft size={24} className="sm:w-8 sm:h-8 mx-auto" />} />
                <NavButton onClick={decrementIndex} icon={<ChevronLeft size={24} className="sm:w-8 sm:h-8 mx-auto" />} />
                <NavButton onClick={incrementIndex} icon={<ChevronRight size={24} className="sm:w-8 sm:h-8 mx-auto" />} />
                <NavButton onClick={goToLast} icon={<ChevronsRight size={24} className="sm:w-8 sm:h-8 mx-auto" />} />
              </div>
              <p className='hidden sm:block bg-secnd rounded-lg w-full text-white font-bold text-center p-4 text-xs sm:text-base shadow-md hover:bg-opacity-90 transition-all truncate' > {`Move ${currentIndex}` || "Moves"}</p>
              <div className='text-white font-bold truncate w-full bg-secnd p-4 text-center text-xs sm:text-base rounded-lg shadow-md transition-all hover:bg-opacity-90 sm:mb-0 mb-4'>
                {currentIndex == fenList.length -1 ?
                  <p className='text-white'>{resultTranslation()}</p> :
                  <p className='text-gray-400'>Game Results</p>
                }
              </div>
              {renderScoreboard()}
            </div>

            <GuessInput
              guess={guess}
              setGuess={handleInputChange}  // Changed from setGuess
              onSubmit={() => submitGuess()}
              disabled={hasSubmitted}
            />
          </div>
          </div>
        </div>
      ) : (
        renderWaitingScreen()
      )}
    </div>
  );
};

export default MultiplayerChessboard;
