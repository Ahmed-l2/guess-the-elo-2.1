import React from 'react';

function ResultPopup({ guess, average, wElo, bElo,  gamelink, onClose, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed z-10 inset-0 flex justify-center items-center  bg-black  backdrop-blur-sm bg-opacity-50">
      <div className="bg-primary w-[40%] h-auto rounded-xl p-10 max-w-sm  shadow-xl ">
      <div className='flex mb-5 flex-col items-center gap-5'>
        <div className='flex items-center w-full justify-between gap-2 '>
        <p className="text-black font-bold p-4 text-2xl border border-accent rounded-md bg-white w-full text-center ">{wElo}</p>
        <p className="text-white font-bold p-4 text-2xl  border border-accent rounded-md bg-black w-full text-center ">{bElo}</p>
        </div>
        <div className='flex flex-col items-center w-full '>
         <p className="text-gray-400 font-bold p-2 rounded-t-md border-b border-gray-600 bg-secnd w-full text-center ">Average ELO</p>
          <p className="text-white font-bold p-10 text-3xl rounded-b-md bg-secnd w-full text-center ">{average}</p>
        </div>
        <div className='flex flex-col items-center w-full '>
         <p className="text-gray-400 font-bold p-2 rounded-t-md bg-secnd border-b border-gray-600 w-full text-center ">Your Guess</p>
          <p className="text-white font-bold p-10 text-3xl rounded-b-md bg-secnd w-full text-center ">{guess}</p>
        </div>
      </div>

      <div className='flex flex-col items-center gap-2'>
      <a href={gamelink} className="text-white font-bold text-center w-full p-3 rounded bg-green-500 ">Game Link</a>
        <button
          onClick={onClose}
          className="bg-accent w-full font-bold text-white p-3 rounded hover:bg-blue-600"
        >Close</button>
        </div>
      </div>
    </div>
  );
}

export default ResultPopup;
