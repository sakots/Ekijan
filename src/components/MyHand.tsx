import { useContext, useState } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const MyHand = () => {
  //配牌
  const dealHand = (deck:[]) => {
    const hand = [];
    for (let i = 0; i < 13; i++) {
      hand.push(deck.shift());
    }
    return hand;
  };
  //ツモ
  const drawTile = (deck:[]) => {
    const drawn = [];
    return drawn.push(deck.shift());
  };

  //ゲーム
  const Game = () => {
    const [wall, setWall] = useState(useContext(Wall));
    const [hand, setHand] = useState(dealHand([...deck]));
    const [remainingDeck, setRemainingDeck] = useState([...deck]);
  };

  const sortedHandList = sortedHand().map((sortedHand) => (
    <button type="button" key={sortedHand.id} className="tile" title={sortedHand.name} dangerouslySetInnerHTML={{ __html: sortedHand.display }}></button>
  ));
  const justDrawnTile = draw().map((draw) => (
    <button type="button" key={draw.id} className="tile" title={draw.name} dangerouslySetInnerHTML={{ __html: draw.display }}></button>
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
