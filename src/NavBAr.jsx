import './style/NavBar.css'
//import { useEffect,useState } from 'react';
function Navbar() {



    return (
        <div className="nav">
        <img src='/dist/assets/favico.png' width={40}></img> 
       <p className="gte_logo" >WHAT'S THE ELO<span id='beta_txt'>BETA</span> <span id='vers_txt'> v1.1</span></p>
        
        <a className="kick_link" href="https://kick.com/darcss"  target="_blank" rel="noopener noreferrer"><img  width="30" src="https://img.freepik.com/premium-vector/kick-logo-vector-download-kick-streaming-icon-logo-vector-eps_691560-10814.jpg?w=826"></img></a>
      
    </div>
    );
  }
  
  export default Navbar;