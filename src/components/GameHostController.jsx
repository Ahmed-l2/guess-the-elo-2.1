import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { databases, client } from '../lib/appwrite';
import { useAtomValue } from 'jotai';
import { user } from '../atoms/userAtom';

// This component doesn't render anything visible
// It just manages the game state for the host
const GameHostController = () => {
  const { id: partyId } = useParams();
  const playerData = useAtomValue(user);
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [timePerRound, setTimePerRound] = useState(60);
  const [gameQueue, setGameQueue] = useState([]);
  const [roundTimer, setRoundTimer] = useState(null);
  const [roundEndTimer, setRoundEndTimer] = useState(null);

  // Check if current user is host
  useEffect(() => {
    const checkHostStatus = async () => {
      try {
        const response = await databases.getDocument(
          "672e683c001beba0b2a6",
          "678ad4ab0017e805fec9",
          partyId
        );

        setIsHost(response.hostId === playerData.userId);
        setGameState(response.status);
        setCurrentRound(response.CurrentRound);
        setTotalRounds(response.rounds);
        setTimePerRound(response.time_per_round);

        if (response.gameQueue) {
          setGameQueue(response.gameQueue);
        }

        const parsedPlayers = response.players.map(player => JSON.parse(player));
        setPlayers(parsedPlayers);
      } catch (error) {
        console.error("Error checking host status:", error);
      }
    };

    checkHostStatus();

    // Subscribe to document changes
    const unsubscribe = client.subscribe(
      `databases.672e683c001beba0b2a6.collections.678ad4ab0017e805fec9.documents.${partyId}`,
      (response) => {
        if (response.payload) {
          const data = response.payload;

          setGameState(data.status);
          setCurrentRound(data.CurrentRound);

          if (data.players) {
            const parsedPlayers = data.players.map(player => JSON.parse(player));
            setPlayers(parsedPlayers);
          }

          if (data.gameQueue) {
            setGameQueue(data.gameQueue);
          }
        }
      }
    );

    return () => {
      unsubscribe();
      if (roundTimer) clearTimeout(roundTimer);
      if (roundEndTimer) clearTimeout(roundEndTimer);
    };
  }, [partyId, playerData.userId]);

  // Game state management for the host
  useEffect(() => {
    // Only the host should control game state transitions
    if (!isHost) return;

    const manageGameState = async () => {
      if (gameState === 'playing') {
        // Start round timer
        if (roundTimer) clearTimeout(roundTimer);

        const timer = setTimeout(async () => {
          // Round time is up, move to results state
          await databases.updateDocument(
            "672e683c001beba0b2a6",
            "678ad4ab0017e805fec9",
            partyId,
            {
              status: "results",
              roundResults: JSON.stringify(players.map(player => ({
                id: player.id,
                username: player.username,
                lastGuess: player.lastGuess || 'No guess',
                roundScore: player.roundScore || 0
              })))
            }
          );
        }, timePerRound * 1000);

        setRoundTimer(timer);
      } else if (gameState === 'results') {
        // Show results for a few seconds, then proceed to next round
        if (roundEndTimer) clearTimeout(roundEndTimer);

        const timer = setTimeout(async () => {
          if (currentRound < totalRounds) {
            // Move to next round
            const nextRound = currentRound + 1;

            // Remove the current game from the queue
            const updatedQueue = [...gameQueue];
            updatedQueue.shift();

            await databases.updateDocument(
              "672e683c001beba0b2a6",
              "678ad4ab0017e805fec9",
              partyId,
              {
                status: "playing",
                CurrentRound: nextRound,
                gameQueue: updatedQueue
              }
            );
          } else {
            // Game is finished
            await databases.updateDocument(
              "672e683c001beba0b2a6",
              "678ad4ab0017e805fec9",
              partyId,
              {
                status: "finished"
              }
            );
          }
        }, 10000); // Show results for 10 seconds

        setRoundEndTimer(timer);
      }
    };

    manageGameState();

    return () => {
      if (roundTimer) clearTimeout(roundTimer);
      if (roundEndTimer) clearTimeout(roundEndTimer);
    };
  }, [gameState, currentRound, isHost, players, timePerRound, totalRounds, gameQueue, partyId]);

  // This component doesn't render anything
  return null;
};

export default GameHostController;
