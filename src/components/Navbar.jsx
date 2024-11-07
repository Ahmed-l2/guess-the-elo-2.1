import React, { useState } from "react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative top-0 w-full z-50 backdrop-blur-md border-b-2 border-b-accent">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <img
              id="logo_img"
              src="/logo.png"
              width={40}
              className="mx-2 rounded-lg hover:transition-transform hover:duration-500 hover:rotate-360"
            />
            <p className="text-white text-xl font-bold sm:text-sm flex items-center cursor-default">
              WHAT'S THE ELO
              <span id="beta_txt" className="text-[--button-color] text-xl sm:text-base ml-5 sm:ml-2">
                BETA
              </span>
              <span id="vers_txt" className="text-accent text-xl sm:text-base ml-1">
                v2.0
              </span>
            </p>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className={`${isOpen ? 'absolute top-full right-0 bg-black/50 backdrop-blur-md p-4 mt-2' : ''}`}>
            <a 
              href="https://codevs.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-white hover:text-accent transition-colors duration-300 md:ml-4 text-lg font-semibold ${!isOpen ? 'hidden md:block' : 'block'}`}
            >
              CODEVS TEAM
            </a>
          </div>
        </div>
      </div>
    );
  }

  export default Navbar;