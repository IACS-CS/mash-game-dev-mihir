import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [anagram, setAnagram] = useState(""); // scrambled words
  const [answer, setAnswer] = useState(""); // correct word
  const [userInput, setUserInput] = useState(""); // user guess
  const [score, setScore] = useState(0); // score
  const [difficulty, setDifficulty] = useState("easy"); // difficulty level
  const [hint, setHint] = useState(""); // hint for harder levels
  const [message, setMessage] = useState(""); // feedback message
  const [gameStarted, setGameStarted] = useState(false); // game started flag

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
  

  useEffect(() => {
    if (gameStarted) {
      generateAnagram();
    }
  }, [difficulty, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    generateAnagram();
  };

  const generateAnagram = () => {
    const wordList = wordLists[difficulty];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const shuffledWord = randomWord.split("").sort(() => Math.random() - 0.5).join("");
    setAnagram(shuffledWord);
    setAnswer(randomWord);
    setHint("");
    setUserInput("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.toLowerCase() === answer.toLowerCase()) {
      setScore((prevScore) => prevScore + 10);
      setMessage("Correct! Well done!");
      generateAnagram();
    } else {
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    setScore((prevScore) => (prevScore >= 10 ? prevScore - 10 : 0));
    setMessage("Incorrect! Try again.");
  };

  const getHint = () => {
    if (hint.length < answer.length) {
      setHint(answer.slice(0, hint.length + 1));
    }
  };

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
