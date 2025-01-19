import "./App.css";
import StartForm from "./components/StartForm";
import Doras from "./components/Doras";
import MyHand from "./components/MyHand";

function App() {
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
