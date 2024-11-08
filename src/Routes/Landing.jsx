import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

export default function Landing(){

    return(
      <>
      <div className='flex flex-col justify-center items-center w-full h-[800px]'>
        <h1 className="text-5xl font-bold text-white mb-12">Welcome to What's The ELO!</h1>
        <div className="max-w-6xl w-full mx-auto p-8 ">
          <div className="flex flex-col md:flex-row justify-center items-center gap-12">
            <Link 
              to="/WTE"
              className="bg-secnd text-white border-2 border-accent w-[400px] h-[300px] p-8 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl  hover:bg-opacity-90 transform transition-all duration-500 ease-in-out"
            >
              <h2 className="text-3xl font-bold mb-4 hover:text-opacity-80">What's The ELO?</h2>
              <p className="text-xl hover:text-opacity-80">Test your skills of analysing games and guessing the elo</p>
            </Link>

            <Link 
              to="/GuessThePlayer"
              className="bg-secnd text-white border-2 border-accent w-[400px] h-[300px] p-8 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:bg-opacity-90 transform transition-all duration-500 ease-in-out"
            >
              <h2 className="text-3xl font-bold mb-4 hover:text-opacity-80">Guess The Player</h2>
              <p className="text-xl hover:text-opacity-80">Challenge yourself to identify players</p>
            </Link>
          </div>
        </div>
      </div>
      </>
    )
  }