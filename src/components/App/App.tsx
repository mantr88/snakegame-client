
import './App.css'
import Food from '../Food/Food';
import Snake from '../Snake/Snake';
import { FormEvent, useEffect, useState } from 'react';

export interface FoodInfo {
  x: number, y: number, weight: number
}

export interface Player {
  id: number,
  name: string,
  score: number,
  createdAt?: Date,
  updatedAt?: Date
}

export const GRID_SIZE = 26;
const DEFAULT_SPEED = 250;

const initialPlayers: Player[] = [{
  id: 1,
  name: "First",
  score: 0,
}, {
  id: 2,
  name: "Second",
  score: 0,
}, {
  id: 3,
  name: "Third",
  score: 0,
}]

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [foodInfo, setFoodInfo] = useState<FoodInfo>({ x: 1, y: 1, weight: 1 });
  const [score, setScore] = useState<number>(0);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [countScore, setCountScore] = useState(0);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchPlayers = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://snakegame-server-ks0y.onrender.com/players');
        const players = await response.json();
        setPlayers(players.players)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPlayers();
  }, [])

  const sendPlayer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log('Form submitted');
    setIsStarted(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const nameInput = form.elements.namedItem('player') as HTMLInputElement;
      const player = nameInput?.value;

      const response = await fetch(
        'https://snakegame-server-ks0y.onrender.com/players',
        // 'http://localhost:3022/players',
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: player
          })
        })
      const newPlayer = await response.json();
      setCurrentPlayer(newPlayer.player)
    } catch (error) {
      console.log(error)
    }
  }


  const keyDownHandler = (e: KeyboardEvent) => {
    // console.log(e.key, e.code)

    if (e.code === "Space" || e.key === "") {
      setIsPaused(prevState => !prevState)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);

    return () => removeEventListener('keydown', keyDownHandler);
  }, []);

  const increasesSpeed = (number: number) => {
    setCountScore(prevState => prevState + number);
    if (countScore % 50 === 0) {
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
    }
  }

  const stopGame = () => {
    fetch(
      `https://snakegame-server-ks0y.onrender.com/players/${currentPlayer?.id}`,
      // `https://snakegame-server-ks0y.onrender.com/players/1`,
      {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score })
      })
    setIsStarted(false);
    setScore(0)
    setSpeed(DEFAULT_SPEED)
    setCountScore(0);
  }
  const sortedPlayers = players.sort((a, b) => b.score - a.score)
  const correctedScore = score.toString().padStart(3, '0');

  return (
    <main>
      {isStarted &&
        <aside className='aside'>
          <button className='pause-btn' onClick={() => setIsPaused(prevState => !prevState)}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <h3 className='players-title'>Best players</h3>
          <ol className='players-list'>
            {loading && <><li><span>Player-1: </span>000</li>
              <li><span>Player-2: </span>000</li>
              <li><span>Player-3: </span>000</li></>}
            {!loading && sortedPlayers.map(player => {
              return <li key={player.id}><span>{player.name}: </span>{player.score}</li>
            })}
          </ol>
        </aside>}
      <div>
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
              isPaused={isPaused}
            />
            <Food foodInfo={foodInfo} setFoodInfo={setFoodInfo} triggerUpdate={triggerUpdate} />

          </div>}
          {!isStarted && <div className='wrapper'>
            <img src="./snake.jpg" alt="green snake" className="logo" width="480" />
            <div className="instructions">Please enter your name and press Enter/Return key to start the game</div>
            <form onSubmit={sendPlayer}>
              <input type="text" name='player' placeholder="Enter your name" />
              <button type='submit' style={{ display: "none" }}>Send</button>
            </form  >
          </div>}
        </div>
      </div>
    </main >
  )
}

export default App
