import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MultiplayerChessboard from '../components/MultiplayerChessboard';
import GameHostController from '../components/GameHostController';
import { useAtomValue } from 'jotai';
import { user } from '../atoms/userAtom';
import { client, databases } from '../lib/appwrite';

const MultiplayerGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerData = useAtomValue(user);

  useEffect(() => {
    // (Optionally) fetch initial gameState if you need it here:
    // const fetchInitial = async () => {
    //   const doc = await databases.getDocument(
    //     YOUR_DATABASE_ID,
    //     YOUR_COLLECTION_ID,
    //     id
    //   );
    //   if (doc.gameState === 'lobby') navigate(`/lobby/${id}`);
    // };
    // fetchInitial();

    // Subscribe to realtime updates on this party
    const unsubscribe = client.subscribe(
      `databases.672e683c001beba0b2a6.collections.678ad4ab0017e805fec9.documents.${id}`,
      response => {
        const { gameState } = response.payload;

        if (gameState === 'lobby') {
          navigate(`/lobby/${id}`);
        }
        // (Optional) if you also want to redirect to playing:
        // else if (gameState === 'playing') {
        //   navigate(`/multiplayer/${id}`);
        // }
      }
    );

    return () => unsubscribe();
  }, [id, navigate]);

  return (
    <div className="multiplayer-game-container">
      <GameHostController />
      <MultiplayerChessboard />
    </div>
  );
};

export default MultiplayerGame;
