import dataset from "../dataset.json";
import React from "react";

type wall = typeof dataset.tiles;
const wall = React.createContext(dataset.tiles.toSorted(() => Math.random() - Math.random()));
export default wall;