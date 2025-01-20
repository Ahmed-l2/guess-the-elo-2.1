import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, User, Hash, Plus } from "lucide-react";
import { Query } from "appwrite";
import { databases } from "../lib/appwrite";
import { v4 as uuidv4 } from "uuid";
import { useAtom } from "jotai";
import { user } from "../GlobalContext/atoms";

function PartyCreation() {
  const [username, setUsername] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const [value, setValue] = useAtom(user);

  const handleJoinParty = async () => {
    if (!username) {
        showError("Please choose a username!");
        return;
    }
    if (!partyCode) {
        showError("Please enter a party code to join!");
        return;
    }

    try {
        const response = await databases.listDocuments(
            "672e683c001beba0b2a6",
            "678ad4ab0017e805fec9",
            [
                Query.equal('partyId', partyCode)
            ]
        );
        console.log(response);

        if (response.documents.length === 0) {
            showError("Party not found. Please check the code and try again.");
            return;
        }

        const partyDocument = response.documents[0]; // Access the first document
        if (partyDocument.status !== "waiting") {
            showError("The party has already started or expired.");
            return;
        }

        // Parse the players array to JSON
        const players = partyDocument.players.map((player) => JSON.parse(player));

        // Parse and check blacklist
        const blacklist = partyDocument.blacklist.map((item) => JSON.parse(item));
        console.log('blacklist :', blacklist);
        if (blacklist.some(item => item.id === value.userId)) {
            showError("Cannot Join party");
            return;
        }

        if (players.length >= 3) {
            showError("Party is full.");
            return;
        }

        // Retrieve the current user from the Jotai atom
        const currentUser = players.find(
            (player) => player.username === username && player.id === value.userId
        );

        if (currentUser) {
            // If the user exists, navigate to the lobby
            setValue({
                username: currentUser.username,
                userId: currentUser.id,
                partyCode,
            });
            navigate(`/lobby/${partyDocument.$id}`);
        } else {
            // If the user does not exist, add them as a new player
            const newPlayer = {
                id: value.userId || uuidv4(),
                username,
                score: "0",
            };

            const updatedPlayers = [
                ...partyDocument.players,
                JSON.stringify(newPlayer),
            ];

            await databases.updateDocument(
                "672e683c001beba0b2a6",
                "678ad4ab0017e805fec9",
                partyDocument.$id,
                { players: updatedPlayers }
            );

            // Update the Jotai atom with the new player's information
            setValue({
                username,
                userId: newPlayer.id,
                partyCode,
            });
            navigate(`/lobby/${partyDocument.$id}`);
        }
    } catch (error) {
        console.error("Party not found. Please check the code and try again.", error.message);
        // showError("Party not found. Please check the code and try again.");
    }
};
  const handleCreateParty = async () => {
    if (!username) {
      showError("Please choose a username!");
      return;
    }

    try {
      const hostId = uuidv4();
      const partyId = Math.random().toString(36).substring(2, 10);
      localStorage.setItem("hostId", hostId);

      const response = await databases.createDocument(
        "672e683c001beba0b2a6",
        "678ad4ab0017e805fec9",
        uuidv4(),
        {
          partyId: partyId,
          hostId: hostId,
          players: [
            JSON.stringify({ id: hostId, username: username, score: "0" }),
          ],
          status: "waiting",
          rounds: 3,
          CurrentRound: 1,
          gameQueue: [],
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          time_per_round: 60,
        }
      );
      setValue({ username, userId: hostId, partyCode: partyId });
      navigate(`/lobby/${response.$id}`, { state: { username } });
    } catch (error) {
      console.error("Error creating party:", error);
      showError("Failed to create party. Please try again.");
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col justify-center items-center w-full min-h-[700px] md:min-h-screen mt-16 relative overflow-hidden px-4"
    >
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 left-4 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {errorMessage}
        </motion.div>
      )}

      <motion.h1
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-5xl md:text-6xl font-luckiest lg:text-8xl font-bold text-white mb-10 animate-pulse text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
      >
        Join or Create a Party
      </motion.h1>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mx-auto mt-2 md:mt-10 p-4 md:p-8"
      >
        <div className="flex flex-col gap-6">
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={24}
            />
            <input
              type="text"
              placeholder="Choose Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 pl-12 text-lg rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
            />
          </div>

          <div className="relative">
            <Hash
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={24}
            />
            <input
              type="text"
              placeholder="Enter Party Code"
              value={partyCode}
              onChange={(e) => setPartyCode(e.target.value)}
              className="w-full p-4 pl-12 text-lg rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50"
            />
          </div>

          <button
            onClick={handleJoinParty}
            className="w-full p-4 text-lg font-luckiest bg-orange-400 border-2 border-white/20 rounded-xl text-white hover:bg-orange-400/80 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Users size={24} />
            Join Party
          </button>

          <div className="text-white text-center text-lg font-luckiest">- OR -</div>

          <button
            onClick={handleCreateParty}
            className="w-full p-4 text-lg font-luckiest bg-green-500 border-2 border-white/20 rounded-xl text-white hover:bg-green-500/80 transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <Plus size={24} />
            Create New Party
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PartyCreation;
