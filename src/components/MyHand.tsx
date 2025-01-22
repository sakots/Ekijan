import { useContext } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const MyHand = () => {
  const wall = useContext(Wall);
  const firstHand = wall.slice(0,13);
  console.log(firstHand);
  const sortedHand = firstHand.sort((a, b) => a.id - b.id);
  const firstDraw = wall.slice(13,14);

  const justDrawnTile = firstDraw.map((draw) => (
    <button type="button" key={draw.id} className="tile" title={draw.name} dangerouslySetInnerHTML={{ __html: draw.display }}></button>
  ));
  const sortedHandList = sortedHand.map((sortedHand) => (
    <button type="button" key={sortedHand.id} className="tile" title={sortedHand.name} dangerouslySetInnerHTML={{ __html: sortedHand.display }}></button>
  ));

  return (
    <>
      <div className="hand">
        {sortedHandList}
        {justDrawnTile}
      </div>
    </>
  )
}

export default MyHand
