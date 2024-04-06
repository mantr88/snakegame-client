
import './App.css'
import Food from '../Food/Food';
import Snake from '../Snake/Snake';
import { useEffect, useState } from 'react';

export interface FoodInfo {
  x: number, y: number, weight: number
}

export const GRID_SIZE = 26;

function App() {
  const [isStarted, setIsStarted] = useState(false)
  console.log("isStarted: ", isStarted)
  const [foodInfo, setFoodInfo] = useState<FoodInfo>({ x: 1, y: 1, weight: 1 })
  const [score, setScore] = useState<number>(0)
  const [triggerUpdate, setTriggerUpdate] = useState(false);



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

  const stopGame = () => {
    console.log('first')
    setIsStarted(false);
  }

  const correctedScore = score.toString().padStart(3, '0');

  return (
    <main>
      {isStarted && <ul className='scores'>
        <li className='score'><span>Score </span>{correctedScore}</li>
        <li className='highScore'><span>High Score </span>000</li>
      </ul>}
      <div className="border">
        {isStarted && <div className="game-board">
          <Snake
            isStarted={isStarted}
            foodInfo={foodInfo}
            setScore={setScore}
            setTriggerUpdate={setTriggerUpdate}
            stopGame={stopGame}
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
