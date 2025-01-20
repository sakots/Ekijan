import { useContext } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const MyHand = () => {
  const wall = useContext(Wall);
  const hand = wall.slice(0,13);
  const sortedHand = hand.sort((a, b) => a.id - b.id);
  const draw = wall.slice(13,14);
  console.log(draw);
  const drawList = draw.map((draw) => (
    <button type="button" key={draw.id} className="tile" title={draw.name} dangerouslySetInnerHTML={{ __html: draw.display }}></button>
  ));
  console.log(sortedHand);
  const sortedHandList = sortedHand.map((sortedHand) => (
    <button type="button" key={sortedHand.id} className="tile" title={sortedHand.name} dangerouslySetInnerHTML={{ __html: sortedHand.display }}></button>
  ));
  return (
    <>
      <div className="hand">
        {sortedHandList}
        {drawList}
      </div>
    </>
  )
}

export default MyHand
