import React, {useEffect,useState } from 'react';
import Chessground from '@react-chess/chessground';
import './chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import './App.css'





const ChessBoard = ({ fenList , details}) => {
  


  const [guess, setGuess] = useState('');
  const [currentIndex, setCurrentIndex] = useState(1);
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




  const handleInputChange = (e) => { // checking guess input
    setGuess(e.target.value);//#1dd1a1
    if (e.target.value){
      document.getElementById('sub_guess').style='background-color:#10ac84;color:white'
   
    }else{

      document.getElementById('sub_guess').style='background-color:#4d4d4d;color:silver;'
    
    }
    
  };

  if (currentIndex == fenList.length -1){


                    g_res.style='color:silver;background-color:#4d4d4d;'
                    if (result == '1-0'){
                        if (matchTermination == "Time forfeit"){g_res.innerHTML=`White won by timeout`;}
                        else{g_res.innerHTML=`White won`;}
                    }
                    else if(result == '0-1'){
                        if (matchTermination == "Time forfeit"){g_res.innerHTML=`Black won by timeout`;}
                        else{g_res.innerHTML=`Black won`;}
                    }
                    else if(result == '1/2-1/2'){

                        g_res.innerHTML=`Draw`;}

  }

  const sub_func = () =>{
    new Audio("./sfx/click.mp3").play();
    if (!guess){
      //#1dd1a1 btn color freen
      
    }
    else{
      const  user_guess = guessed_inp.value;
    
                if (user_guess.trim() !== "") {
                  
                    guessed_inp.disabled = true;
                    document.getElementById('sub_guess').disabled = true;
                    guessed_inp.style='cursor:not-allowed;background-color: #4d4d4d;'

                    w_elo.innerHTML = whiteElo;
                    b_elo.innerHTML = blackElo;
                    g_avrg.innerHTML = `${averageElo.toString().split('.')[0]}`;


                    next_game.style = 'color:white;background-color:#e58e26';


                    if (user_guess > averageElo && (user_guess-averageElo) < 100 && (user_guess-averageElo) > 50|| user_guess < averageElo && (averageElo-user_guess) < 100 && (averageElo-user_guess) > 50){
                        result_info.innerHTML= 'Good guess ! '
                        result_info.style = 'color:white;background-color:#74b9ff';
                        g_avrg.style='background-color:#74b9ff;color:white'
                    }else if (user_guess > averageElo && (user_guess-averageElo) <= 50 && (user_guess-averageElo) > 5|| user_guess < averageElo && (averageElo-user_guess) <= 50 && (averageElo-user_guess) > 5){
                        result_info.innerHTML= "Wow, you're almost there!"
                        result_info.style = 'color:white;background-color:#0be881';
                        g_avrg.style='background-color:#0be881;color:white'
                    }
                    else if (user_guess > averageElo && (user_guess-averageElo) <= 10 && (user_guess-averageElo) > 0|| user_guess < averageElo && (averageElo-user_guess) <= 10 && (averageElo-user_guess) > 0){
                        result_info.innerHTML= "Wait ! , Are you cheating ?"
                        result_info.style = "color:white;background-color:#feca57;";
                        g_avrg.style='background-color:#feca57;color:white'
                    }

                    else if (user_guess > averageElo && (user_guess-averageElo) >= 100 || user_guess < averageElo && (averageElo-user_guess) >=100){
                        result_info.innerHTML= "Your guess is a bit off"
                        result_info.style = 'color:white;background-color:#e17055';
                        g_avrg.style='background-color:#e17055;color:white';
                    }
                    else if (user_guess == averageElo){
                        document.body.style='background-color:black'

                        result_info.innerHTML= "GOAT GUESS";
                        g_avrg.style="background-color:#fff;color:black";
                        goat.play()
                        result_info.style = "color:white;background-size:cover;background-image:url('https://media1.tenor.com/m/3NxNq1agx5EAAAAd/hikaru-chess.gif');-webkit-text-stroke: 3px gold;text-shadow:1px 1px 20px white";

                    }}


                    document.getElementById("next_game").style='color:white;background-color:#e58e26';

    }
    
  }

  const next_game = () =>{
    location.reload()
  }

  const incrementIndex = () => {
    new Audio("./sfx/move-self.mp3").play();

    setCurrentIndex((prevIndex) => (prevIndex + 1) % fenList.length);
 
  };





  const decrementIndex = () => {
    new Audio("./sfx/move-self.mp3").play();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fenList.length) % fenList.length);
  
  };

  const goToFirst = () => {
    new Audio("./sfx/click.mp3").play();
    setCurrentIndex(0);
  };

  const goToLast = () => {
    new Audio("./sfx/click.mp3").play();
    setCurrentIndex(fenList.length - 1);
  };
  
  



  return (
   
    <div >

 
      <div className="box" id="box-b">
    
        <div className="board-container">
        <Chessground
        className="board"

        width={750}
        height={750}
        KeyBindingComponent="true"
        


        config={{ fen: fenList[currentIndex] ,

          draggable: true, // Disable piece dragging
          movable: {
            free: false, // Disable piece movement
            dests: true // Disable destination highlighting
          },
          premove: false, // Disable premoves
        // Set the initial position
        }}
      />
        </div>
        <div className="info-panel">
          
            <p id="g_type">{event}</p>

            <div className="ratings-conta">
                
                <p id="w_elo"></p>
                <p id="b_elo"></p>
                
        </div>
            <p id="g_res">Game result</p>
            

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
        </div>
       
    </div>
     
    
    </div>
    
  );
};

export default ChessBoard;
