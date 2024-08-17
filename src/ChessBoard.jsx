import React, { useEffect, useState } from 'react';
import Chessground from '@react-chess/chessground';
import './style/chessgroundBaseOverride.css';
import './style/chessgroundColorsOverride.css';
import './style/pieces/maestro.css';
import './style/App.css'


const ChessBoard = ({ fenList , details}) => {


    const [guess, setGuess] = useState('');
    const [currentIndex, setCurrentIndex] = useState(1);
    const [boardSize, setBoardSize] = useState(750);
    // game DATA
    const whiteElo = details.whiteElo;
    const blackElo = details.blackElo;
    const event = details.event;
    const result = details.result;
    const opening = details.opening;
    const matchTermination = details.termination
    const averageElo_normal = (whiteElo + blackElo) / 2;
    const averageElo = Math.floor(averageElo_normal);
    const guessed_inp = document.getElementById('guess_inp');
    const gamelink = details.gameLink;
    
    const updateBoardSize = () => {
      const width = window.innerWidth;
      let size;

      if (width <= 450) {
          size = 420;
      } else {
          size = Math.min(width * 0.5, 750);
      }

      setBoardSize(size);
    };


    useEffect(() => {
      updateBoardSize();
      window.addEventListener('resize', updateBoardSize);

      // Force a re-render after a short delay to ensure correct initial size
      const timer = setTimeout(() => {
        updateBoardSize();
      }, 100);

      return () => {
        window.removeEventListener('resize', updateBoardSize);
        clearTimeout(timer);
      };
    }, []);

    const handleInputChange = (e) => { // checking guess input
      setGuess(e.target.value);//#1dd1a1
      if (e.target.value){
        document.getElementById('sub_guess').style='background-color:var(--button-color);color:white'

      }else{

        document.getElementById('sub_guess').style='background-color:#4d4d4d;color:silver;'

      }

    };

    if (currentIndex == fenList.length -1){

                      g_res.style='color:silver;background-color:#4d4d4d;'
                      if (result == '1-0'){
                          if (matchTermination == "Time forfeit"){g_res.innerHTML=`White won by timeout`;}
                          else{g_res.innerHTML=`White ${details.termination}`;}
                      }
                      else if(result == '0-1'){
                          if (matchTermination == "Time forfeit"){g_res.innerHTML=`Black won by timeout`;}
                          else{g_res.innerHTML=`Black ${details.termination}`;}
                      }
                      else if(result == '1/2-1/2'){

                          g_res.innerHTML=`Draw`;}

    }





    const sub_func = () =>{
      if (!guess){
        //#1dd1a1 btn color freen
      }
      else{
          new Audio("./sfx/click.mp3").play();
          const  user_guess = guessed_inp.value;

                  if (user_guess.trim() !== "") {

                      guessed_inp.disabled = true;
                      document.getElementById('sub_guess').disabled = true;
                      document.getElementById('next_game').disabled = false;
                      guessed_inp.style='cursor:not-allowed;background-color: #57636c;'


                      w_elo.innerHTML = whiteElo;
                      b_elo.innerHTML = blackElo;
                      g_avrg.innerHTML = `${averageElo.toString().split('.')[0]}`;
                      g_avrg.style='border:5px solid white'
                      g_res.style='color:silver;background-color:#4d4d4d;'
                      op_name.style='color:silver;background-color:#4d4d4d;'
                      if (result == '1-0'){
                          if (matchTermination == "Time forfeit"){g_res.innerHTML=`White won by timeout`;}
                          else{g_res.innerHTML=`White ${details.termination}`;}
                      }
                      else if(result == '0-1'){
                          if (matchTermination == "Time forfeit"){g_res.innerHTML=`Black won by timeout`;}
                          else{g_res.innerHTML=`Black ${details.termination}`;}
                      }
                      else if(result == '1/2-1/2'){

                          g_res.innerHTML=`Draw`;}

                      next_game.style = 'color:white;background-color:#e58e26';


                      if (user_guess > averageElo && (user_guess-averageElo) < 100 && (user_guess-averageElo) > 50|| user_guess < averageElo && (averageElo-user_guess) < 100 && (averageElo-user_guess) > 50){
                          result_info.innerHTML= 'Good guess ! '
                          result_info.style = 'color:white;background-color:#74b9ff';
                          g_avrg.style='background-color:#74b9ff;color:white'
                      }else if (user_guess > averageElo && (user_guess-averageElo) <= 50 && (user_guess-averageElo) > 5|| user_guess < averageElo && (averageElo-user_guess) <= 50 && (averageElo-user_guess) > 5){
                          result_info.innerHTML= "Wow, you're almost there!"
                          result_info.style = 'color:white;background-color:#63cdda';
                          g_avrg.style='background-color:#63cdda;color:white'
                      }
                      else if (user_guess > averageElo && (user_guess-averageElo) <= 10 && (user_guess-averageElo) > 0|| user_guess < averageElo && (averageElo-user_guess) <= 10 && (averageElo-user_guess) > 0){
                          result_info.innerHTML= "Wait ! Are you cheating ?"
                          result_info.style = "color:white;background-color:#81ecec;";
                          g_avrg.style='background-color:#81ecec;color:white'
                      }

                      else if (user_guess > averageElo && (user_guess-averageElo) >= 100 || user_guess < averageElo && (averageElo-user_guess) >=100){
                          result_info.innerHTML= "Your guess is a bit off"
                          result_info.style = 'color:white;background-color:#b33939';
                          g_avrg.style='background-color:#b33939;color:white;';
                      }
                      else if (user_guess == averageElo){
                          document.body.style='background-color:black'

                          result_info.innerHTML= "GOAT GUESS";
                          g_avrg.style="background-color:#fff;color:black";
                          goat.play()
                          result_info.style = "color:white;background-size:cover;background-image:url('https://media1.tenor.com/m/3NxNq1agx5EAAAAd/hikaru-chess.gif');-webkit-text-stroke: 3px gold;text-shadow:1px 1px 20px white";

                      }}

                      document.getElementById('g_link').href=gamelink;
                      document.getElementById('g_link').style='color:silver;background-color:#4d4d4d;'
                      document.getElementById("next_game").style='color:white;background-color:var(--button-color)';

      }

    }

    const next_game = () => {
      if (guess) {
        location.reload();
      }
    }

    const incrementIndex = () => {
      if (currentIndex !== fenList.length - 1) {
          new Audio("./sfx/move-self.mp3").play();
          setCurrentIndex((prevIndex) => (prevIndex + 1) % fenList.length);
          document.getElementById('next-move').blur();
      }
    };



    const decrementIndex = () => {
      if (currentIndex !== 0) {
        new Audio("./sfx/move-self.mp3").play();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + fenList.length) % fenList.length);
        document.getElementById('prev-move').blur();
      }
    };

    const goToFirst = () => {
      new Audio("./sfx/click.mp3").play();
      setCurrentIndex(0);
    };

    const goToLast = () => {
      new Audio("./sfx/click.mp3").play();
      setCurrentIndex(fenList.length - 1);
    };

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
          incrementIndex();
        } else if (event.key === 'ArrowLeft') {
          decrementIndex();
        } else if (event.key === 'Enter' && guess) {
          sub_func();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [currentIndex, fenList.length, guess]);



    return (

      <div >


        <div className="box" id="box-b">

          <div className="board-container">
          <Chessground
          className="board"
          width={boardSize}
          height={boardSize}
          KeyBindingComponent="true"
          config={{ fen: fenList[currentIndex]}}
          key={boardSize}
        />
          </div>
          <div className="info-panel">
              <p id="g_type">{event}</p>
              
              <div className="ratings-conta">
              <p id="w_elo"></p>
              <p id="b_elo"></p>

          </div>

              <p id="g_res">Game result</p>
              <p id="op_name">{opening}</p>

              <p id="g_avrg">Game average rating</p>
              <p id="result_info"></p>

              <div className="gte_sub_conta" id="ma_div">

                  <input
                      type="number"
                      id="guess_inp"
                      placeholder="Enter Your Guess..."
                      required
                      value={guess}
                      onChange={handleInputChange}

                     />
                  <button id="sub_guess" onClick={sub_func} type="button">Submit</button>

              </div>

              <div className="btn-container">

                  <button id="reset-move" onClick={goToFirst}  className="move-btn">❮❮</button>

                  <button id="prev-move" onClick={decrementIndex} className="move-btn">❮</button>

                  <button id="next-move" onClick={incrementIndex} className="move-btn">❯</button>
                  <button id="skip-move"  onClick={goToLast} className="move-btn">❯❯</button>
              </div>

              <button id="next_game" onClick={next_game}>Next Game</button>
              <a  id="g_link" target="_blank" rel="noopener noreferrer">Game Link</a>
          </div>

      </div>


      </div>

    );
};

export default ChessBoard;
