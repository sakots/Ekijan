import { useContext } from "react";
import Wall from "./Wall";
import "../styles/Tiles.css";

const Doras = () => {
  const wall = useContext(Wall);
  console.log(wall);
  const dora = wall.slice(-5);
  const doraList = dora.map((dora) => (
    <button type="button" key={dora.id} className="tile" title={dora.name} dangerouslySetInnerHTML={{ __html: dora.display }}></button>
  ));
  return (
    <>
      <div className="dora">
        {doraList}
      </div>
    </>
  );
};

export default Doras