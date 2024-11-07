import React from "react";
function Navbar() {
    return (
      <div className="relative  top-0   w-full  z-50 flex items-center justify-between  backdrop-blur-md border-b-2 border-b-accent ">
        <div className="flex items-center justify-between p-2">
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
      </div>
    );
  }

  export default Navbar;
