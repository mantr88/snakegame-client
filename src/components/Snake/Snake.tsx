import '../App/App.css'
import { useEffect, useState } from 'react'
enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

type SnakeItem = { x: number; y: number }

interface SnakeProps {
  isStarted: boolean,
}

function Snake({ isStarted }: SnakeProps) {
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

    newSnake.pop();
    setSnake(newSnake);
  }

  const keyDownHandler = (e: KeyboardEvent) => {
    console.log(e.key, e.code)

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

  //TEst
  useEffect(() => {
    let int = setInterval(() => {
      move();
    }, 200)

    return () => clearInterval(int)
  }, [snake])

  return (
    <>{draw(snake)}</>
  )
}

export default Snake