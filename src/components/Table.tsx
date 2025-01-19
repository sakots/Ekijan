import Doras from "./Doras";
import MyHand from "./MyHand";
import Discarded from "./Discarded";
import StartForm from "./StartForm";
import { useState, useContext } from "react";
import Wall from "./Wall";

const Table = () => {
  const [isStarted, setIsStarted] = useState(false);
  const getIsStarted = () => {
    setIsStarted(true);
  };
  const wall = useContext(Wall);
  console.log(wall);

  return (
    <>
      {isStarted ? <Doras /> : <StartForm getIsStarted={getIsStarted} />}
      {isStarted && <Discarded />}
      {isStarted && <MyHand />}
    </>
  );
};

export default Table;