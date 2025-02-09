import { useContext } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const Doras = () => {
  const wall = useContext(Wall);
  const dora = wall.slice(-10, -5);
  const doraList = dora.map((dora) => (
    <button type="button" key={dora.id} className="tile" title="ドラ" dangerouslySetInnerHTML={{ __html: dora.display }}></button>
  ));
  const uraDora = wall.slice(-5);
  const uraDoraList = uraDora.map((uraDora) => (
    <button type="button" key={uraDora.id} className="tile" title="裏ドラ" dangerouslySetInnerHTML={{ __html: uraDora.display }}></button>
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