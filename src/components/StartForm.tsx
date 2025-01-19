import dataset from '../dataset.json';

const startForm = () => {
  const getWallData = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTiles = dataset.tiles;
    const wall = allTiles.toSorted(() => Math.random() - Math.random());
    console.log(wall);
  }
  return (
      <form onSubmit={getWallData}>
          <button type="submit">スタート</button>
      </form>
  )
}

export default startForm