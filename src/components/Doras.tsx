import { useContext } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const Doras = () => {
  const wall = useContext(Wall);
  console.log(wall);
  const dora = wall.slice(-10, -5);
  const doraList = dora.map((dora) => (
    <button type="button" key={dora.id} className="tile" title={dora.name} dangerouslySetInnerHTML={{ __html: dora.display }}></button>
  ));
  const uraDora = wall.slice(-5);
  const uraDoraList = uraDora.map((uraDora) => (
    <button type="button" key={uraDora.id} className="tile" title={uraDora.name} dangerouslySetInnerHTML={{ __html: uraDora.display }}></button>
  ));
  return (
    <>
      <div className="dora">
        {doraList}
      </div>
      <div className="uraDora">
        {uraDoraList}
      </div>
    </>
  );
};

export default Doras