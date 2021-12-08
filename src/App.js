import { useState, useEffect } from 'react';
import './App.css';
import MainMenu from './components/MainMenu/MainMenu';
import Game from './components/Game/Game';
import axios from 'axios';
import { HEROES_URL } from './components/Const';
import { fillHeroes } from './store/heroes/heroesSlice';
import { useDispatch } from 'react-redux';
function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const dispatch = useDispatch();
  useEffect (()=>{
    axios(HEROES_URL)
    .then((response) => {
      dispatch(fillHeroes(response.data));
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
    })
    
  },[])

  return (
   <div className = "container">
     
    {isGameStarted === false ? <MainMenu setIsGameStarted = {setIsGameStarted} /> : <Game/>}
   </div>
  );
}

export default App;
