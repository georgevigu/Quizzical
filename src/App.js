import React from "react"
import Game from "./Game"
import { decode } from 'html-entities';

function App() {
  const [started, setStarted] = React.useState(false)

  function handleStart() {
    setStarted(true)
  }

  return (
    <main>
      {started ?
        <Game />
        :
        <section className="main-menu">
          <h1>Quizzical</h1>
          <p>Enjoy these random trivia questions!</p>
          <button className="btn start" onClick={handleStart}>Start quiz</button>
        </section>}
    </main>

  );
}

export default App;
