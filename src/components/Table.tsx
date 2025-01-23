import Doras from "./Doras";
import Game from "./Game";
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
      {isStarted && <Game />}
    </>
  );
};

export default Table;