import React, { useState, useEffect } from 'react';
import ChessBoard from './ChessBoard';
import { Chess } from 'chess.js';
import { extractMatchDetails } from './pgnUtils';

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
  const randomKey = gameKeys[Math.floor(Math.random() * gameKeys.length)];
  return games[randomKey];
};

// Function to parse PGN and generate a list of FENs
const parsePGNForFENs = (pgn) => {
  const game = new Chess();
  const fenList = [];

  // Remove metadata and result lines
  const moves = pgn
    .split('\n') // Split by lines
    .filter(line => !line.startsWith('[') && line.trim() !== '') // Remove metadata lines
    .join(' ') // Join remaining lines into a single string
    .replace(/\d+\.\s*|\s+/g, ' ')  // Remove move numbers and extra whitespace
    .trim()
    .split(/\s+(?=[\w-])/); // Split by moves (space followed by a move)

  fenList.push(game.fen()); // Add the starting position

  moves.forEach(move => {
    try {
      const result = game.move(move);
      if (result) {
        fenList.push(game.fen());
      } else {
        console.warn(`Invalid move: ${move}`); // Log invalid moves
      }
    } catch (error) {
      console.warn(`Error processing move: ${move}`, error);
    }
  });

  return fenList;
};

const App = () => {
  const [fenList, setFenList] = useState([]);
  const [matchDetails, setMatchDetails] = useState({});

  useEffect(() => {
    const loadPGN = async () => {
      const content = await fetchPGNContent('/pgns/matches.pgn');
      const games = parsePGN(content);
      const randomPGN = selectRandomPGN(games);

      if (randomPGN) {
        const fens = parsePGNForFENs(randomPGN);
        setFenList(fens);

        // Extract and log match details
        const details = extractMatchDetails(randomPGN);
        setMatchDetails(details);
        console.log('Match Details:', details);
      }
    };

    loadPGN();
  }, []);

  return (
    <div>
      <h1>Chess Board</h1>
      <ChessBoard fenList={fenList} />
    </div>
  );
};

export default App;
