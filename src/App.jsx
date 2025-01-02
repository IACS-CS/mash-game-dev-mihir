import React, { useState, useEffect } from "react";
import "./App.css";

// The main component of the app
const App = () => {
  // State variables to manage different aspects of the game
  const [anagram, setAnagram] = useState(""); // scrambled word to display
  const [answer, setAnswer] = useState(""); // correct word to check against
  const [userInput, setUserInput] = useState(""); // user's guess input
  const [score, setScore] = useState(0); // user's score
  const [difficulty, setDifficulty] = useState("easy"); // difficulty level of the game
  const [hint, setHint] = useState(""); // hint for harder difficulty levels
  const [message, setMessage] = useState(""); // feedback message for the user
  const [gameStarted, setGameStarted] = useState(false); // flag to check if the game has started

  // Word lists categorized by difficulty levels
  const wordLists = {
    easy: [
      "USA", "India", "China", "Brazil", "Italy", "Spain", 
      "Japan", "Egypt", "Chile", "Peru", "Cuba", "Iran",
      "Nepal", "Oman", "Fiji", "Qatar", "Malta", "Chad"
    ],
    medium: [
      "Russia", "Mexico", "Germany", "Nigeria", "France", 
      "Canada", "Turkey", "Sweden", "Poland", "Greece", 
      "Norway", "Argentina", "Belgium", "Austria", "Serbia",
      "Kenya", "Angola", "Libya", "Gabon", "Jamaica"
    ],
    hard: [
      "Portugal", "Thailand", "Vietnam", "Hungary", "Finland", 
      "Malaysia", "Philippines", "Colombia", "Ukraine", 
      "Singapore", "Morocco", "Croatia", "Bulgaria", "Slovakia",
      "Lithuania", "Latvia", "Estonia", "Jordan", "Albania"
    ],
    expert: [
      "Zimbabwe", "Kazakhstan", "Ecuador", "Sri Lanka", "Belarus", 
      "Madagascar", "Guatemala", "Luxembourg", "Azerbaijan", 
      "Kyrgyzstan", "Liechtenstein", "Turkmenistan", "Tajikistan",
      "Uzbekistan", "Mauritania", "Equatorial Guinea", "Eswatini",
      "Djibouti", "Burkina Faso"
    ],
  };
  
  // useEffect hook to trigger actions when the game starts or difficulty changes
  useEffect(() => {
    if (gameStarted) {
      generateAnagram(); // generate a new anagram when the game starts or difficulty changes
    }
  }, [difficulty, gameStarted]);

  // Function to start the game
  const startGame = () => {
    setGameStarted(true);
    generateAnagram();
  };

  // Function to generate a new anagram from the word list based on the selected difficulty
  const generateAnagram = () => {
    const wordList = wordLists[difficulty]; // select the appropriate word list
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)]; // pick a random word
    const shuffledWord = randomWord.split("").sort(() => Math.random() - 0.5).join(""); // shuffle the word
    setAnagram(shuffledWord); // set the shuffled word as the anagram
    setAnswer(randomWord); // set the original word as the answer
    setHint(""); // reset hint
    setUserInput(""); // reset user input
    setMessage(""); // reset feedback message
  };

  // Function to handle form submission when the user submits their guess
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.toLowerCase() === answer.toLowerCase()) {
      setScore((prevScore) => prevScore + 10); // increase score for correct answer
      setMessage("Correct! Well done!"); // set success message
      generateAnagram(); // generate a new anagram
    } else {
      handleWrongAnswer(); // handle incorrect answer
    }
  };

  // Function to handle incorrect answers
  const handleWrongAnswer = () => {
    setScore((prevScore) => (prevScore >= 10 ? prevScore - 10 : 0)); // decrease score or set to zero
    setMessage("Incorrect! Try again."); // set failure message
  };

  // Function to provide a hint for harder difficulty levels
  const getHint = () => {
    if (hint.length < answer.length) {
      setHint(answer.slice(0, hint.length + 1)); // reveal one more character of the answer as hint
    }
  };

  // JSX to render the game interface
  return (
    <div className="game-container">
      <h1>Country Anagram Game</h1>
      <p>Score: {score}</p>

      {!gameStarted ? (
        <button onClick={startGame} className="start-button">Start Game</button>
      ) : (
        <>
          <div className="settings">
            <label htmlFor="difficulty">Difficulty: </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="anagram-display">
            <p>Unscramble this: <strong>{anagram}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Your guess"
            />
            <button type="submit">Submit</button>
          </form>

          {message && <p className="message">{message}</p>}

          {(difficulty === "hard" || difficulty === "expert") && (
            <button onClick={getHint} className="hint-button">Get a Hint</button>
          )}

          {hint && <p className="hint">Hint: {hint}</p>}

          <button onClick={generateAnagram} className="next-button">Next Word</button>
        </>
      )}
    </div>
  );
};

export default App;
