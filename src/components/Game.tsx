import { useContext, useState } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const Game = () => {

  const [deck, setDeck] = useState(useContext(Wall));
  setDeck(deck.sort(() => Math.random() - Math.random()));
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);

  //初期配牌
  const dealFirstHand = () => {
    const firstHand = [];
    for (let i = 0; i < 13; i++) {
      firstHand.push(deck.shift());
    }
    return setHand(firstHand);
  };
  //ツモ
  const drawTile = () => {
    const drawn = [];
    return drawn.push(deck.shift());
  };
  // 牌を捨てる
  const discardTile = (index: number) => {
    const tileToDiscard = hand[index];
    setDiscardPile([...discardPile, tileToDiscard]);
    setHand(hand.filter((_, i) => i !== index));
  };

  //手牌をソート
  const sortedHand = () => {
    return hand.sort((a, b) => a.id - b.id);
  }
  const sortedHandList = sortedHand().map((sortedHand) => (
    <button type="button" key={sortedHand.id} className="tile" title={sortedHand.name} dangerouslySetInnerHTML={{ __html: sortedHand.display }}></button>
  ));

  const justDrawnTile = drawTile().map((draw) => (
    <button type="button" key={draw.id} className="tile" title={draw.name} dangerouslySetInnerHTML={{ __html: draw.display }}></button>
  ));

  return (
    <>
      <div className="hand">
        {sortedHandList}
        {justDrawnTile}
      </div>
    </>
  );
};

export default Game;