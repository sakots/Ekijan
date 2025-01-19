import StartForm from "./components/StartForm";
import Doras from "./components/Doras";
import MyHand from "./components/MyHand";
import "./App.css";

const App = () => {
  return (
    <>
      <h1>駅雀 2025</h1>
      <StartForm />
      <div className="table">
        <Doras />
        <MyHand />
      </div>
    </>
  )
}

export default App
