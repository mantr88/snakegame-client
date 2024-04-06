import { useState, useEffect } from 'react';
import '../App/App.css'
import { FoodInfo } from '../App/App';

interface FoodProps {
  foodInfo: FoodInfo,
  setFoodInfo: (args: FoodInfo) => void
}

const randomNumbOfFoodType = () => Math.floor((Math.random() * 3) + 1);
const randomCoordinateOfFood = () => Math.floor((Math.random() * 26) + 1);

function Food({ foodInfo, setFoodInfo }: FoodProps) {
  const [typeOfFood, setTypeOfFood] = useState(randomNumbOfFoodType())
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const changeWeight = (number: number) => {
    let weight = 1;
    switch (number) {
      case 1:
        weight = 1;
        break;
      case 2:
        weight = 10;
        break;
      case 3:
        weight = 50;
        break;
    }
    return weight;
  }

  useEffect(() => {
    const newWeight = changeWeight(typeOfFood);
    const xFood = randomCoordinateOfFood();
    const yFood = randomCoordinateOfFood();
    setFoodInfo({ x: xFood, y: yFood, weight: newWeight });
  }, [triggerUpdate]); // Depend on triggerUpdate to run the effect

  return <div className={`food-${typeOfFood}-type`}
    style={{ gridColumn: `${foodInfo.x}`, gridRow: `${foodInfo.y}` }}></div>
}

// const updateFoodInfo = () => {
//   setTypeOfFood(randomNumbOfFoodType());
//   setTriggerUpdate(!triggerUpdate); // Toggle triggerUpdate to trigger the effect


// return (
//   <>{drawFood(typeOfFood)}</>
// )
// }

export default Food
