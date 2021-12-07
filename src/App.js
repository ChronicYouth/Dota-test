import { useState, useEffect } from 'react';
import './App.css';
import MainMenu from './components/MainMenu/MainMenu';
import Game from './components/Game/Game';
import axios from 'axios';
import { HEROES_URL } from './components/Const';
function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [heroes, setHeroes] = useState([]);



  useEffect (()=>{
    axios(HEROES_URL)
    .then((response) => {
      setHeroes(response.data)
    })

    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
    })
    
  },[])

  return (
   <div className = "container">
     
    {isGameStarted === false ? <MainMenu setIsGameStarted = {setIsGameStarted} /> : <Game heroes = {heroes}/>}
   </div>
  );
}

export default App;
