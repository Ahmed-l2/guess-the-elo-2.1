import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chessboard from './components/Chessboard';
import Navbar from './components/Navbar';
import Landing from './Routes/Landing';
import GuessThePlayer from './Routes/GuessThePlayer';

const App = () => {

  return (
    <Router>
      <div className='flex flex-col gap-4'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/WTE" element={<Chessboard />} />
          <Route path="/GuessThePlayer" element={<GuessThePlayer/>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
