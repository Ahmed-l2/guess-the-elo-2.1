import React, { useState } from 'react';
import Chessground from '@react-chess/chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';

const ChessBoard = ({ fenList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const incrementIndex = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fenList.length);
  };

  const decrementIndex = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fenList.length) % fenList.length);
  };

  const goToFirst = () => {
    setCurrentIndex(0);
  };

  const goToLast = () => {
    setCurrentIndex(fenList.length - 1);
  };

  return (
    <div>
      <Chessground
        width={400}
        height={400}
        config={{ fen: fenList[currentIndex] }}
      />
      <button onClick={goToFirst}>First</button>
      <button onClick={decrementIndex}>Previous</button>
      <button onClick={incrementIndex}>Next</button>
      <button onClick={goToLast}>Last</button>
    </div>
  );
};

export default ChessBoard;
