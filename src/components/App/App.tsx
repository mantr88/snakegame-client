
import './App.css'
import Food from '../Food/Food';
import Snake from '../Snake/Snake';
import { useEffect, useState } from 'react';

export interface FoodInfo {
  x: number, y: number, weight: number
}

export const GRID_SIZE = 26;
const DEFAULT_SPEED = 250;

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [foodInfo, setFoodInfo] = useState<FoodInfo>({ x: 1, y: 1, weight: 1 });
  const [score, setScore] = useState<number>(0);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [countScore, setCountScore] = useState(0);



  const keyDownHandler = (e: KeyboardEvent) => {
    // console.log(e.key, e.code)
    if (!isStarted && e.key === 'Enter') {
      // startGame()
      setIsStarted(true);
      // console.log(e.key, e.code)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);

    return () => removeEventListener('keydown', keyDownHandler);
  }, []);

  const increasesSpeed = (number: number) => {
    setCountScore(prevState => prevState + number);
    console.log(countScore)
    if (countScore >= 50) {
      if (speed > 150) {
        setSpeed(prevState => prevState - 10);
      } else if (speed > 100) {
        setSpeed(prevState => prevState - 3);
      } else if (speed > 50) {
        setSpeed(prevState => prevState - 2);
      } else if (speed > 25) {
        setSpeed(prevState => prevState - 1);
      }
      setCountScore(0);
      console.log(speed);
    }
  }

  const stopGame = () => {
    setIsStarted(false);
    setScore(0)
    setSpeed(DEFAULT_SPEED)
    setCountScore(0);
  }

  const correctedScore = score.toString().padStart(3, '0');

  return (
    <main>
      {isStarted && <ul className='scores'>
        <li className='score'><span>Score </span>{correctedScore}</li>
        <li className='score'><span>Speed </span>{speed}</li>
        <li className='highScore'><span>High Score </span>000</li>
      </ul>}
      <div className="border">
        {isStarted && <div className="game-board">
          <Snake
            foodInfo={foodInfo}
            setScore={setScore}
            setTriggerUpdate={setTriggerUpdate}
            stopGame={stopGame}
            speed={speed}
            increasesSpeed={increasesSpeed}
          />
          <Food foodInfo={foodInfo} setFoodInfo={setFoodInfo} triggerUpdate={triggerUpdate} />
        </div>}
        {!isStarted && <div className='wrapper'>
          <img src="./snake.jpg" alt="green snake" className="logo" width="480" />
          <div className="instructions">Press Enter/Return key to start the game</div>
        </div>}
      </div>

    </main >
  )
}

export default App
