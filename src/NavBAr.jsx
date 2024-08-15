import './style/NavBar.css'
//import { useEffect,useState } from 'react';
function Navbar() {



    return (
        <div className="nav">
        <img id='logo_img' src='/logo.png' width={40}/> 
       <p className="gte_logo" >WHAT'S THE ELO<span id='beta_txt'>BETA</span> <span id='vers_txt'> v1.1</span></p>
        
        <a className="kick_link" href="https://kick.com/darcss"  target="_blank" rel="noopener noreferrer"><img  width="80" src="https://static.wikia.nocookie.net/logopedia/images/e/e6/Kick_%28Print%29.svg"></img></a>
      
    </div>
    );
  }
  
  export default Navbar;