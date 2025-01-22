import Doras from "./Doras";
import MyHand from "./MyHand";
import Discarded from "./Discarded";
import StartForm from "./StartForm";
import { useState } from "react";

const Table = () => {
  const [isStarted, setIsStarted] = useState(0);
  const getIsStarted = () => {
    setIsStarted(14);
  };

  return (
    <>
      {isStarted ? <Doras /> : <StartForm getIsStarted={getIsStarted} />}
      {isStarted ? <Discarded /> : null}
      {isStarted ? <MyHand /> : null}
    </>
  );
};

export default Table;