
import './App.css'
import Food from '../Food/Food';
import Snake from '../Snake/Snake';
import { useEffect, useState } from 'react';

export interface FoodInfo {
  x: number, y: number, weight: number
}




function App() {
  const [isStarted, setIsStarted] = useState(false)
  const [foodInfo, setFoodInfo] = useState<FoodInfo>({ x: 1, y: 1, weight: 1 })


  const keyDownHandler = (e: KeyboardEvent) => {
    console.log(e.key, e.code)
    if (!isStarted && e.key === 'Enter') {
      // startGame()
      setIsStarted(true);
      console.log(e.key, e.code)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)

    return () => removeEventListener('keydown', keyDownHandler);
  }, [])

  return (
    <main>
      {isStarted && <ul className='scores'>
        <li className='score'><span>Score </span>000</li>
        <li className='highScore'><span>High Score </span>000</li>
      </ul>}
      <div className="border">
        {isStarted && <div className="game-board">
          <Snake isStarted={isStarted} />
          <Food foodInfo={foodInfo} setFoodInfo={setFoodInfo} />
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
