import React from 'react';
function MainMenu({setIsGameStarted}) {
 

 
  return (
   <div>
     <button className = 'startBuntton' onClick = {() => setIsGameStarted(true)}>Start Game</button>
   </div>
  );
}

export default MainMenu;
