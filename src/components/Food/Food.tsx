import '../App/App.css'

const randomNumbOfFoodType = () => Math.floor((Math.random() * 3) + 1);
const randomCoordinateOfFood = () => Math.floor((Math.random() * 26) + 1);

function Food() {
  const drawFood = (number: number) => {
    return <div className={`food-${number}-type`} style={{ gridColumn: `${randomCoordinateOfFood()}`, gridRow: `${randomCoordinateOfFood()}` }}></div>
  }
  return (
    <>{drawFood(randomNumbOfFoodType())}</>
  )
}

export default Food