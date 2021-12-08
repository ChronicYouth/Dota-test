import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { API_URL } from '../Const';
import GGWPPng from '../../assets/images/ggwp.png';
import LoadingGif from '../../assets/images/loading.gif';
import { useSelector } from 'react-redux';

function Game() {
  const [firstHero, setFirstHero] = useState({});
  const [secondHero, setSecondHero] = useState({});
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState();
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [points, setPoints] = useState(0);
  const [isRightAnswer, setIsRightAnswer] = useState(false);
  const [isHaveAnswer, setIsHaveAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroId, setHeroId] = useState([]);
  const [usedHeroesId, setUsedHeroesId] = useState([]);
  const [usedQuestionsId, setUsedQuestionsId] = useState([]);
  const [isFirstImgLoaded, setIsFirstImgLoaded] = useState(false);
  const [isSecondImgLoaded, setIsSecondImgLoaded] = useState(false);
  const heroes = useSelector((state) => state.heroes.APIheroes);
  
  const getRandomId = useCallback ((exsistValues) => {
    console.log(exsistValues)
    let randomedId = Math.round(Math.random() * (heroes?.length-1));
    if ( exsistValues.includes(randomedId)){
      randomedId = getRandomId(exsistValues)
    }
   
    return randomedId
  },[heroes])

  const getRandomHero = useCallback (() => {
    const firstHeroId = getRandomId(usedHeroesId);
    const secondHeroId = getRandomId([...usedHeroesId, firstHeroId]);
    setUsedHeroesId((prevState) => [...prevState, firstHeroId, secondHeroId]);
    return setHeroId ([firstHeroId, secondHeroId]);
  },[getRandomId, usedHeroesId]);
  // console.log(usedHeroesId)
  useEffect (()=>{
    if(heroes.length !== 0){
      getRandomHero();
      setIsLoading(false);
    }
  },[heroes])
  //console.log(heroId);
  useEffect(() =>{ 
    if (!heroes){return}
  setFirstHero ({
    name: heroes[heroId[0]]?.localized_name,
    avatarUrl: `${API_URL}${heroes[heroId[0]]?.img}`,
  })
  setSecondHero({
    name: heroes[heroId[1]]?.localized_name,
    avatarUrl: `${API_URL}${heroes[heroId[1]]?.img}`,
  })
  },[heroes, heroId])

 //повесить проверку
  const ALL_QUESTIONS = useMemo(() => { 
    return(heroId.length !== 0) && [
    {
      quest:'Чей базовый мувспид больше?',
      firstHeroValue:heroes[heroId[0]]?.move_speed,
      secondHeroValue: heroes[heroId[1]]?.move_speed,
      
    },
    {
      quest:'У кого больше базовая броня?',
      firstHeroValue: heroes[heroId[0]]?.base_armor + heroes[heroId[0]]?.base_agi * 0.168,
      secondHeroValue: heroes[heroId[1]]?.base_armor + heroes[heroId[1]]?.base_agi * 0.168,
    },
    {
      quest:'У кого больше базовых очков здоровья?',
      firstHeroValue: heroes[heroId[0]]?.base_health + heroes[heroId[0]]?.base_str * 20,
      secondHeroValue: heroes[heroId[1]]?.base_health + heroes[heroId[1]]?.base_str * 20,
    },
    {
      quest:'У кого больше базовых очков маны?',
      firstHeroValue: heroes[heroId[0]]?.base_mana + heroes[heroId[0]]?.base_int * 12,
      secondHeroValue: heroes[heroId[1]]?.base_mana + heroes[heroId[1]]?.base_int * 12,
    },
    {
      quest:'У кого больше базовый прирост силы?',
      firstHeroValue: heroes[heroId[0]]?.str_gain,
      secondHeroValue: heroes[heroId[1]]?.str_gain,
    },
    {
      quest:'У кого больше базовый прирост интеллекта?',
      firstHeroValue: heroes[heroId[0]]?.int_gain,
      secondHeroValue: heroes[heroId[1]]?.int_gain,
    },
    {
      quest:'У кого больше базовый прирост ловкости?',
      firstHeroValue: heroes[heroId[0]]?.agi_gain,
      secondHeroValue: heroes[heroId[1]]?.agi_gain,
    },
    {
      quest:'У кого больше базовая атака',
      firstHeroValue: (heroes[heroId[0]]?.base_attack_max + heroes[heroId[0]]?.base_attack_min) / 2,
      secondHeroValue: (heroes[heroId[1]]?.base_attack_max + heroes[heroId[1]]?.base_attack_min) / 2,
    },
  ]},[heroes, heroId]);
  
  const Bigger = useCallback ((arr) =>  
    arr[currentQuestionId]?.firstHeroValue > arr[currentQuestionId]?.secondHeroValue ? 
    arr[currentQuestionId]?.firstHeroValue : 
    arr[currentQuestionId]?.secondHeroValue
  ,[currentQuestionId])


  const isRenderButton = useMemo(() => !isHaveAnswer && !isGameEnd, [isHaveAnswer, isGameEnd]);
  useEffect (() => {
    setQuestion(ALL_QUESTIONS[currentQuestionId]?.quest);
    setAnswer(Bigger(ALL_QUESTIONS));
  },[ALL_QUESTIONS, currentQuestionId, Bigger]);
  


  const getRandomQuestionId = useCallback ((exsistValues) => {
    let randomedId = Math.round(Math.random() * (ALL_QUESTIONS?.length - 1));
    if ( exsistValues.includes(randomedId)){
      randomedId = getRandomQuestionId(exsistValues)
    }
    return randomedId
  },[ALL_QUESTIONS])

  const getRandomQuestion = useCallback (() => {
    const currentQuestion = getRandomQuestionId(usedQuestionsId);
    setUsedQuestionsId((prevState) => [...prevState, currentQuestion])
    return setCurrentQuestionId (currentQuestion);
  },[usedQuestionsId, getRandomQuestionId]);
  
  useEffect (() => {
    getRandomQuestion()
    },[ALL_QUESTIONS])

  const compare = useCallback((value) => () => {
    setIsFirstImgLoaded(false);
    setIsSecondImgLoaded(false);
    setIsHaveAnswer(true);
    setTimeout(() => {
      if (usedQuestionsId.length < ALL_QUESTIONS.length) {
      getRandomHero();
      getRandomQuestion();
    }
    
      setIsHaveAnswer(false);
    }, 1000);
    if (usedQuestionsId.length >= ALL_QUESTIONS.length) {
      setIsGameEnd(true);
      return;
    }
    if (value === answer) {
      setIsRightAnswer(true);
      setPoints((prevState) => prevState + 1);
      return;
    } 
    setIsRightAnswer(false); 
    setPoints((prevState) => prevState -1);
  }, [answer, ALL_QUESTIONS]);
  
  const renderBottomBox = useCallback(() => {
    if (isGameEnd) {
      return (
        <h1>Игра закончилась :)</h1>
      )
    }
    if (!isHaveAnswer) {
      return (
        <h1>{question}</h1>
      );
    }
    return isRightAnswer ? <h1>Вы выиграли</h1> : <h1>Вы проиграли</h1>;
  }, [isHaveAnswer, isGameEnd, isRightAnswer, question]);
  
  const handleRestart = useCallback(() => () =>{ 
    setUsedQuestionsId([]);
    getRandomQuestion();
    setPoints(0);
    setIsRightAnswer(false);
    setIsGameEnd(false);
    setIsHaveAnswer(false);
    getRandomHero();
    setIsFirstImgLoaded(false);
    setIsSecondImgLoaded(false);
  },[getRandomHero]);


  const firstImage = useMemo(() => {
    return <img onLoad = {setIsFirstImgLoaded(true)} alt="firstHero" src={firstHero.avatarUrl} width="256px" height="144px" style={{ opacity: isFirstImgLoaded ? 1 : 0}}/>
   }, [heroId, isFirstImgLoaded, firstHero]) 
   const secondImage = useMemo(() => {
    return <img onLoad = {setIsSecondImgLoaded(true)} alt="secondHero" src={secondHero.avatarUrl} width="256px" height="144px" style={{ opacity: isSecondImgLoaded ? 1 : 0}}/>
   }, [heroId, isSecondImgLoaded, secondHero]) 


  
  if(isLoading){
    return  <div>Загрузка...</div>
  }
  return (
    <div className = 'game'>
      {isGameEnd? (<img alt = 'WinImg' src = {GGWPPng}/>):
      (<>
      <div className = 'hero'>
        <>
          {/* <img alt = 'Загрузка ...' src ={LoadingGif} style={{ opacity: isFirstImgLoaded ? 0 : 1}} height="144px"/> */}
          {firstImage}
        </>
        <h3>{firstHero.name}</h3>
        {isRenderButton && (
          <button onClick={compare(ALL_QUESTIONS[currentQuestionId]?.firstHeroValue)}>тыц</button>
        )}
      </div>
      <h1>VS</h1>
      <div className = 'hero'>
        <>
          {/* <img alt = 'Загрузка ...' src ={LoadingGif} style={{ opacity: isSecondImgLoaded ? 0 : 1}} height="144px"/> */}
          {secondImage}
        </>
        <h3>{secondHero.name}</h3>
        {isRenderButton && (
          <button onClick={compare(ALL_QUESTIONS[currentQuestionId]?.secondHeroValue)}>тыц</button>
        )}
      </div>
      </>)
      }
      <h2>{points}PTS</h2>
      {renderBottomBox()}
      <button onClick = {handleRestart()}>RESTART</button>
    </div>
  );
}

export default Game;
