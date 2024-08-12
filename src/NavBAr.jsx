import './style/NavBar.css'
//import { useEffect,useState } from 'react';
function Navbar() {



    return (
        <div className="nav">
        <p className="gte_logo" >Guess The Elo 2.0 <span id='beta_txt'> BETA</span> <span id='vers_txt'> v1.1</span></p>

        <a className="kick_link" href="https://kick.com/darcss"><img  width="30" src="https://img.freepik.com/premium-vector/kick-logo-vector-download-kick-streaming-icon-logo-vector-eps_691560-10814.jpg?w=826"></img></a>
      
    </div>
    );
  }
  
  export default Navbar;