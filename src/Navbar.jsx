
function Navbar() {
    return (
      <div className="fixed top-0 left-0 w-full min-h-[50px] z-1000 flex items-center bg-opacity-70 bg-[--nav-bar-bg] backdrop-blur-md border-b border-[--button-color] p-1 sm:p-0">
        <img
          id="logo_img"
          src="/logo.png"
          width={40}
          className="mx-2 rounded-lg hover:transition-transform hover:duration-500 hover:rotate-360"
        />
        <p className="text-white text-lg sm:text-sm flex items-center cursor-default">
          WHAT'S THE ELO
          <span id="beta_txt" className="text-[--button-color] text-xl sm:text-base ml-5 sm:ml-2">
            BETA
          </span>
          <span id="vers_txt" className="text-silver text-xl sm:text-base ml-1">
            v2.0
          </span>
        </p>
        <a
          className="ml-auto mr-12 sm:mr-0 filter invert"
          href="https://kick.com/darcss"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img width="80" src="https://static.wikia.nocookie.net/logopedia/images/e/e6/Kick_%28Print%29.svg" />
        </a>
      </div>
    );
  }

  export default Navbar;
