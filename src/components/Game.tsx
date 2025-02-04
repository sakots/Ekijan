import { useContext, useState, useEffect } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const Game = () => {

  const [deck, setDeck] = useState(useContext(Wall));
  setDeck(deck.sort(() => Math.random() - Math.random()));
  const [hand, setHand] = useState<{ name: string; display: string; id: number; sort: number; number: number[]; tags: string[]; wind?: string[]; dora?: string[]; dragon?: string[]; }[]>([]);
  const [discardPile, setDiscardPile] = useState<{ name: string; display: string; id: number; sort: number; number: number[]; tags: string[]; wind?: string[]; dora?: string[]; dragon?: string[]; }[]>([]);
  const [pointer, setPointer] = useState(0)

  //初期配牌
  const dealFirstHand = () => {
    const firstHand = deck.slice(0,13)
    setPointer(13)
    return setHand(firstHand as { name: string; display: string; id: number; sort: number; number: number[]; tags: string[]; wind?: string[]; dora?: string[]; dragon?: string[]; }[]);
  };

  //ツモ
  const drawTile = () => {
    const drawn = deck.slice(pointer, pointer +1)
    setPointer(pointer +1)
    return drawn
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

  useEffect(() => {
    dealFirstHand();
  })

  console.log(hand)

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