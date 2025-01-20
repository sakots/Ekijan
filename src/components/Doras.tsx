import { useContext } from "react";
import Wall from "./Wall";
import "./Tiles.css";

const Doras = () => {
  const wall = useContext(Wall);
  console.log(wall);
  const dora = wall.slice(-5);
  console.log(dora);
  const doraList = dora.map((dora) => (
    <button type="button" key={dora.id} className="tile">
      {dora.name}
    </button>
  ));
  return (
    <div className="doras">
      {doraList}
    </div>
  );
};

export default Doras