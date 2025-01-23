import { useContext, useState } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const Game = () => {
  const [deck, setDeck] = useState(useContext(Wall));
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);

  //初期配牌
  const dealFirstHand = (deck:[]) => {
    const firstHand = [];
    for (let i = 0; i < 13; i++) {
      firstHand.push(deck.shift());
    }
    return firstHand;
  };
  //ツモ
  const drawTile = (deck:[]) => {
    const drawn = [];
    return drawn.push(deck.shift());
  };
  // 牌を捨てる
  const discardTile = (index: number) => {
    const tileToDiscard = hand[index];
    setDiscardPile([...discardPile, tileToDiscard]);
    setHand(hand.filter((_, i) => i !== index));
  };

  return (
    <></>
  );
};

export default Game;