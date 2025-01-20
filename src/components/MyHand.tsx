import { useContext } from "react";
import Wall from "./Wall";
import "./Tiles.css"

const MyHand = () => {
  const wall = useContext(Wall);
  const hand = wall.slice(0,14);
  const sortedHand = hand.sort((a, b) => a.id - b.id);
  console.log(sortedHand);
  const sortedHandList = sortedHand.map((sortedHand) => (
    <button type="button" key={sortedHand.id} className="tile" title={sortedHand.name} dangerouslySetInnerHTML={{ __html: sortedHand.name }}></button>
  ));
  return (
    <>
      <div className="hand">
        {sortedHandList}
      </div>
    </>
  )
}

export default MyHand
