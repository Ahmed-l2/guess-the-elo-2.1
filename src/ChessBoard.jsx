import React, {useEffect,useState } from 'react';
import Chessground from '@react-chess/chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import './App.css'




const ChessBoard = ({ fenList }) => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const incrementIndex = () => {
    new Audio("./public/sfx/move-self.mp3").play();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fenList.length);
  };

  const decrementIndex = () => {
    new Audio("./public/sfx/move-self.mp3").play();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fenList.length) % fenList.length);
  };

  const goToFirst = () => {
    new Audio("./public/sfx/click.mp3").play();
    setCurrentIndex(0);
  };

  const goToLast = () => {
    new Audio("./public/sfx/click.mp3").play();
    setCurrentIndex(fenList.length - 1);
  };

  


  return (
   
    <div >

      
      <div className="box" id="box-b">
    
        <div className="board-container">
        <Chessground
        className="board"
        width={800}
        height={800}
        KeyBindingComponent="true"
        


        config={{ fen: fenList[currentIndex] }}
      />
        </div>
        <div className="info-panel">
          
            <p id="g_type">Game type</p>

            <div className="ratings-conta">
                
                <p id="w_elo"></p>
                <p id="b_elo"></p>
                
        </div>
            <p id="g_res">Game result</p>
            

        <p id="g_avrg">Game average rating</p>
        <p id="result_info"></p>

            <div className="gte_sub_conta" id="ma_div">
             
                <input type="number" id="guess_inp" placeholder="Enter Your Guess..." required />
                <button id="sub_guess" type="button">Submit</button>
                
            </div>

            <div className="btn-container">
                <button id="reset-move" onClick={goToFirst}  className="move-btn">|❮</button>
                <button id="prev-move" onClick={decrementIndex} className="move-btn">❮</button>
                
                <button id="next-move" onClick={incrementIndex} className="move-btn">❯</button>
                <button id="skip-move"  onClick={goToLast} className="move-btn">❯|</button>
            </div>

            <button id="next_game">Next Game</button>
        </div>
       
    </div>
     
    
    </div>
    
  );
};

export default ChessBoard;
