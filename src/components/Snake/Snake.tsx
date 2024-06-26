
import { SnakeItem, SnakeProps } from '../../types';
import { GRID_SIZE } from '../App/App';
import '../App/App.css'
import { useEffect, useState } from 'react'

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

function Snake({ foodInfo, setScore, setTriggerUpdate,
  stopGame, delay, increasesSpeed, isPaused }: SnakeProps) {

  const [snake, setSnake] = useState<SnakeItem[]>([{ x: 13, y: 13 }])
  const [direction, setDirection] = useState<Direction>(Direction.Right)


  const draw = (snake: SnakeItem[]) => {
    return snake.map(({ x, y }) => {
      return <div className='snake' key={`${x}-${y}`} style={{ gridColumn: `${x}`, gridRow: `${y}` }}></div>
    })
  }

  const move = () => {
    const newSnake = [...snake];
    switch (direction) {
      case Direction.Right:
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y });
        break;
      case Direction.Left:
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y });
        break;
      case Direction.Up:
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
        break;
      case Direction.Down:
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
        break;
    }

    if (foodInfo.x === newSnake[0].x && foodInfo.y === newSnake[0].y) {
      switch (foodInfo.weight) {
        case 1:
          setScore(pervState => pervState + 1);
          increasesSpeed(1);
          break;
        case 5:
          setScore(pervState => pervState + 5);
          increasesSpeed(5);
          break;
        case 50:
          setScore(pervState => pervState + 50);
          increasesSpeed(50);
          break;
      }

      setTriggerUpdate(prevState => !prevState)
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  const keyDownHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection(Direction.Up);
        break;
      case 'ArrowDown':
        setDirection(Direction.Down);
        break;
      case 'ArrowLeft':
        setDirection(Direction.Left);
        break;
      case 'ArrowRight':
        setDirection(Direction.Right);
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)

    return () => removeEventListener('keydown', keyDownHandler);
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        move();
        checkCollision();
      }
    }, delay);


    return () => clearInterval(interval);

  }, [snake, isPaused, delay]);

  const checkCollision = () => {
    const head = snake[0];
    if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
      stopGame()
    }

    for (let i = 1; i < snake.length; i += 1) {
      const element = snake[i];
      if (head.x === element.x && head.y === element.y) {
        stopGame()
      }
    }
  }

  return (
    <>{draw(snake)}</>
  )
}

export default Snake