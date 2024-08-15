import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';


const ChessViewer = () => {
  const [position, setPosition] = useState('start');
  const [fenList, setFenList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('./pgns/matches.pgn')
      .then(response => response.text())
      .then(content => {
        console.log('PGN Content:', content); // Log content for debugging
        const games = parsePGN(content);
        const selectedPGN = selectValidPGN(games);
        if (selectedPGN) {
          const fens = parsePGNForFENs(selectedPGN);
          setFenList(fens);
          if (fens.length > 0) {
            setPosition(fens[0]); // Set initial position
          }
        }
        console.log(selectedPGN)
      })
      .catch(error => console.error('Error reading the PGN file:', error));
  }, []);

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

  const selectValidPGN = (games) => {
    // Implement the logic to select a valid PGN
    // For simplicity, returning the first game
    return games[1];
  };

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

        }
      } catch (error) {
      
      }
    });


    return fenList;
  };

  return
};

export default ChessViewer;
