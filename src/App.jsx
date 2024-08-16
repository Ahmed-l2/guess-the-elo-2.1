import React, { useState, useEffect } from 'react';
import ChessBoard from './ChessBoard';
import { Chess } from 'chess.js';
import { extractMatchDetails } from './pgnUtils';
import Navbar from './NavBAr';
import './style/App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


// Function to fetch and parse PGN content
const fetchPGNContent = async (url) => {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error('Error fetching PGN file:', error);
    return '';
  }
};

// Function to parse PGN content and return individual games
const parsePGN = (content) => {
  const games = {};
  const splitGames = content.split(/\n\n(?=\[Event)/); // Split on two newlines before each [Event]

  splitGames.forEach((game, index) => {
    if (game) {
      games[index + 1] = game.trim(); // Index games from 1 and trim extra spaces
    }
  });

  return games;
};

// Function to select a random game from the parsed games
const selectRandomPGN = (games) => {
    const gameKeys = Object.keys(games);
    let selectedPGN = null;

    while (!selectedPGN && gameKeys.length > 0) {
      const randomIndex = Math.floor(Math.random() * gameKeys.length);
      const randomKey = gameKeys[randomIndex];
      const randomGame = games[randomKey];

      const matchInfo = extractMatchDetails(randomGame);

      if (matchInfo.whiteElo !== null && matchInfo.blackElo !== null) {
        const eloDifference = Math.abs(matchInfo.whiteElo - matchInfo.blackElo);

        if (eloDifference <= 200) {
          selectedPGN = randomGame;
        }
      }

      gameKeys.splice(randomIndex, 1);
    }

    return selectedPGN;
  };

// Function to parse PGN and generate a list of FENs
const parsePGNForFENs = (pgn) => {
    const game = new Chess();
    const fenList = [];

    // Remove metadata lines, result lines, and { [%eval ...] } annotations
    const moves = pgn
      .split('\n') // Split by lines
      .filter(line => !line.startsWith('[') && line.trim() !== '') // Remove metadata lines
      .join(' ') // Join remaining lines into a single string
      .replace(/\d+\.\s*|\s+/g, ' ') // Remove move numbers and extra whitespace
      .trim()
      .split(/\s+(?=[\w-])/); // Split by moves (space followed by a move)

    fenList.push(game.fen()); // Add the starting position

    moves.forEach(move => {
      // Clean up move by removing extra symbols
      const cleanedMove = move.replace(/[\?!\+\-]+$/, '').trim(); // Remove common move symbols and trailing spaces

      try {
        const result = game.move(cleanedMove);
        if (result) {
          fenList.push(game.fen());
        } else {

        }
      } catch (error) {

      }
    });

    return fenList;
  };


const App = () => {
  const [fenList, setFenList] = useState([]);
  const [matchDetails, setMatchDetails] = useState({});

  useEffect(() => {
    const loadPGN = async () => {
      const content = await fetchPGNContent('/pgns/filtered_games.pgn');
      const games = parsePGN(content);
      const randomPGN = selectRandomPGN(games);

      if (randomPGN) {
        const fens = parsePGNForFENs(randomPGN);
        setFenList(fens);

        // Extract and log match details
        const details = extractMatchDetails(randomPGN);
        setMatchDetails(details);

      }
    };

    loadPGN();


  }, []);


  return (
    <div>
      <Navbar />
        <audio id="goat" src="./sfx/goat.mp3"></audio>
        <audio id="moves_s" src="./sfx/move-self.mp3"></audio>
        <audio id="click_s" src="./sfx/click.mp3"></audio>
      <ChessBoard  fenList={fenList} details={matchDetails} />

    </div>
  );
};

export default App;
