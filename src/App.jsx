import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Chessboard from './components/Chessboard';
import Navbar from './components/Navbar';
import Landing from './Routes/Landing';
import PartyCreation from './Routes/PartyCreation';
import Lobby from './Routes/Lobby';
import PlayerLobby from './Routes/PlayerLobby';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <Landing />
              </motion.div>
            }
          />
          <Route
            path="/WTE"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <Chessboard />
              </motion.div>
            }
          />
          <Route
            path="/party"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <PartyCreation />
              </motion.div>
            }
          />
          <Route
            path="/lobby/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <Lobby />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
