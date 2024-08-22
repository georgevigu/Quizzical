import React from "react";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

export default function Game() {
  const [questions, setQuestions] = React.useState([]);
  const [endGame, setEndGame] = React.useState(false);

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
  }, []);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

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

  const questionElements = questions.map((q) => {
    const answerElements = q.allAnswers.map((answer, index) => {
      let correctIndex;
      if (answer === q.correct_answer) {
        correctIndex = index;
      }

      return (
        <button
          key={index} // Use index as key since answers are shuffled
          className={`btn-answer ${
            endGame ? "btn-gray" : q.selectedIndex === index ? "selected" : ""
          }`}
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

  function handleCheck() {
    console.log("Checking..");
    setEndGame(true);
  }

  return (
    <section className="question-list">
      {questionElements}
      <button className="btn btn-check" onClick={handleCheck}>
        Check answers
      </button>
    </section>
  );
}
