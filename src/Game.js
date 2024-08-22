import React from "react";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

export default function Game() {
  const [questions, setQuestions] = React.useState([]);
  const [playAgain, setPlayAgain] = React.useState(false);
  const [endGame, setEndGame] = React.useState(false);
  const [correctAnswers, setCorrectAnswers] = React.useState(0);

  const correctAnswerStyle = {
    backgroundColor: "#94D7A2",
    border: "none",
  };

  const wrongAnswerStyle = {
    backgroundColor: "#F8BCBC",
    opacity: 0.5,
  };

  const grayAnswerStyle = {
    opacity: 0.5,
  };

  React.useEffect(() => {
    async function fetchTrivia() {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5");
        const data = await response.json();

        const questionsWithIds = data.results.map((q) => {
          const allAnswers = [...q.incorrect_answers, q.correct_answer];
          shuffleArray(allAnswers);
          return {
            id: nanoid(),
            ...q,
            selectedIndex: -1,
            allAnswers: allAnswers,
          };
        });

        setQuestions(questionsWithIds);
      } catch (error) {
        console.error("Error fetching trivia:", error);
      }
    }

    fetchTrivia();
  }, [playAgain]);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  const questionElements = questions.map((q) => {
    const answerElements = q.allAnswers.map((answer, index) => {
      const correctIndex = q.allAnswers.indexOf(q.correct_answer);

      let style = null;
      if (endGame) {
        if (index === correctIndex) {
          style = correctAnswerStyle; // Correct answer styling
        } else if (q.selectedIndex === index) {
          style = wrongAnswerStyle; // Incorrect selected answer styling
        } else {
          style = grayAnswerStyle; // Gray answer styling
        }
      }

      return (
        <button
          key={index} // Use index as key since answers are shuffled
          className={`btn-answer ${
            q.selectedIndex === index ? "selected" : ""
          }`}
          style={style}
          onClick={() => handleSelect(q.id, index)}
        >
          {decode(answer)}
        </button>
      );
    });

    return (
      <div key={q.id} className="question">
        <h2>{decode(q.question)}</h2>
        {answerElements}
      </div>
    );
  });

  function handleSelect(questionId, selectedIndex) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? q.selectedIndex === selectedIndex
            ? {
                ...q,
                selectedIndex: -1,
              }
            : {
                ...q,
                selectedIndex: selectedIndex,
              }
          : q
      )
    );
  }

  function handleCheck() {
    console.log("Checking..");
    setEndGame(true);
    questions.forEach((q) => {
      const correctIndex = q.allAnswers.indexOf(q.correct_answer);
      if (q.selectedIndex === correctIndex) {
        setCorrectAnswers((prevState) => prevState + 1);
      }
    });
  }

  function handlePlayAgain() {
    setEndGame(false);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => ({ ...q, selectedIndex: -1 }))
    );
    setPlayAgain((prevState) => !prevState);
  }

  return (
    <section className="question-list">
      {questionElements}
      {endGame ? (
        <div className="play-again">
          <h2>You scored {correctAnswers}/5 correct answers</h2>
          <button className="btn btn-check" onClick={handlePlayAgain}>
            Play again
          </button>
        </div>
      ) : (
        <button className="btn btn-check" onClick={handleCheck}>
          Check answers
        </button>
      )}
    </section>
  );
}
