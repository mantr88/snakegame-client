
import './App.css'
import Food from '../Food/Food';
import Snake from '../Snake/Snake';
import { FormEvent, useEffect, useState } from 'react';
import { FoodInfo, Player } from '../../types';

export const GRID_SIZE = 26;
const DEFAULT_DELAY = 250;

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
  const [delay, setDelay] = useState(DEFAULT_DELAY);
  const [countScore, setCountScore] = useState(1);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(1)

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
    setIsStarted(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const nameInput = form.elements.namedItem('player') as HTMLInputElement;
      const player = nameInput?.value;

      const response = await fetch(
        'https://snakegame-server-ks0y.onrender.com/players',
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
    if (e.code === "Space" || e.key === "") {
      setIsPaused(prevState => !prevState)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);

    return () => removeEventListener('keydown', keyDownHandler);
  }, []);

  const increasesSpeed = (number: number) => {
    const newCountScore = countScore + number;
    setCountScore(prevState => prevState + number);
    if (newCountScore >= 50) {
      if (delay > 150) {
        setDelay(prevState => prevState - 10);
      } else if (delay > 100) {
        setDelay(prevState => prevState - 3);
      } else if (delay > 50) {
        setDelay(prevState => prevState - 2);
      } else if (delay > 25) {
        setDelay(prevState => prevState - 1);
      }
      setSpeed(prevState => prevState + 1)
      setCountScore(0);
    }
  }

  const stopGame = () => {
    if (score !== 0) {
      fetch(
        `https://snakegame-server-ks0y.onrender.com/players/${currentPlayer?.id}`,
        {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ score })
        })
    }
    setIsStarted(false);
    setScore(0)
    setDelay(DEFAULT_DELAY)
    setCountScore(0);
    setSpeed(1);
  }

  const sortedPlayers = players.sort((a, b) => b.score - a.score);
  const bestScorePlayers = sortedPlayers[0].score;
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
          <li className='highScore'><span>High Score </span> {!loading ? bestScorePlayers : '000'}</li>
        </ul>}
        <div className="border">
          {isStarted && <div className="game-board">
            <Snake
              foodInfo={foodInfo}
              setScore={setScore}
              setTriggerUpdate={setTriggerUpdate}
              stopGame={stopGame}
              delay={delay}
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
