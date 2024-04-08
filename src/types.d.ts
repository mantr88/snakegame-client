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

export interface FoodProps {
  foodInfo: FoodInfo,
  setFoodInfo: (args: FoodInfo) => void,
  triggerUpdate: boolean,
}



export type SnakeItem = { x: number; y: number }

export interface SnakeProps {
  foodInfo: FoodInfo,
  setScore: (arg: (prevState: number) => number) => void,
  setTriggerUpdate: (arg: (prevState: boolean) => boolean) => void,
  stopGame: () => void
  delay: number,
  increasesSpeed: (arg: number) => void,
  isPaused: boolean
}