import { useState, useEffect } from 'react';
import '../App/App.css'
import { FoodProps } from '../../types';



const randomNumbOfFoodType = () => Math.floor((Math.random() * 3) + 1);
const randomCoordinateOfFood = () => Math.floor((Math.random() * 26) + 1);

function Food({ foodInfo, setFoodInfo, triggerUpdate }: FoodProps) {

  const [typeOfFood, setTypeOfFood] = useState(randomNumbOfFoodType())

  const changeWeight = (number: number) => {
    let weight = 1;
    switch (number) {
      case 1:
        weight = 1;
        break;
      case 2:
        weight = 5;
        break;
      case 3:
        weight = 50;
        break;
    }
    return weight;
  }

  useEffect(() => {
    const newTypeOfFood = randomNumbOfFoodType();
    setTypeOfFood(newTypeOfFood);
    const newWeight = changeWeight(newTypeOfFood);
    const xFood = randomCoordinateOfFood();
    const yFood = randomCoordinateOfFood();
    setFoodInfo({ x: xFood, y: yFood, weight: newWeight });
  }, [triggerUpdate]);

  return <div className={`food-${typeOfFood}-type`}
    style={{ gridColumn: `${foodInfo.x}`, gridRow: `${foodInfo.y}` }}></div>
}

export default Food
