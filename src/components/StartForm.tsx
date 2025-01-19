const startForm = (props: { getIsStarted: (arg0: boolean) => void; }) => {
  const getIsStarted = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.getIsStarted(true);
  }

  return (
    <form onSubmit={getIsStarted}>
      <button type="submit">スタート</button>
    </form>
  )
}

export default startForm