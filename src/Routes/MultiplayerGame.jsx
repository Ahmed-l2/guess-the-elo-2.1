import React from 'react';
import { useParams } from 'react-router-dom';
import MultiplayerChessboard from '../components/MultiplayerChessboard';
import GameHostController from '../components/GameHostController';
import { useAtomValue } from 'jotai';
import { user } from '../atoms/userAtom'; // Corrected path to your user atom

const MultiplayerGame = () => {
  const { id } = useParams();
  const playerData = useAtomValue(user);

  return (
    <div className="multiplayer-game-container">
      <GameHostController />
      <MultiplayerChessboard />
    </div>
  );
};

export default MultiplayerGame;
