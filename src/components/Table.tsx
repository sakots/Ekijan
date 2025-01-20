import Doras from "./Doras";
import MyHand from "./MyHand";
import Discarded from "./Discarded";
import StartForm from "./StartForm";
import { useState } from "react";

const Table = () => {
  const [isStarted, setIsStarted] = useState(false);
  const getIsStarted = () => {
    setIsStarted(true);
  };

  return (
    <>
      {isStarted ? <Doras /> : <StartForm getIsStarted={getIsStarted} />}
      {isStarted && <Discarded />}
      {isStarted && <MyHand />}
    </>
  );
};

export default Table;