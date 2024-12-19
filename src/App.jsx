import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [anagram, setAnagram] = useState("");// scrambled words
  const [answer, setAnswer] = useState(""); // gives u differnt words
  const [userInput, setUserInput] = useState(""); // your guess box 
  const [score, setScore] = useState(0); // if u get it right its 1o points 
  const [difficulty, setDifficulty] = useState("easy"); // differnt level types 
  const [hint, setHint] = useState(""); // only on harder level 
  const [message, setMessage] = useState(""); // right or worng 

  const wordLists = {
    easy: [
      "USA", "India", "China", "Brazil", "Italy", "Spain", 
      "Japan", "Egypt", "Chile", "Peru", "Cuba", "Iran"
    ],
    medium: [
      "Russia", "Mexico", "Germany", "Nigeria", "France", 
      "Canada", "Turkey", "Sweden", "Poland", "Greece", "Norway", "Argentina"
    ],
    hard: [
      "Portugal", "Thailand", "Vietnam", "Hungary", "Finland", 
      "Malaysia", "Philippines", "Colombia", "Ukraine", "Singapore", "Morocco", "Croatia"
    ],
    expert: [
      "Zimbabwe", "Kazakhstan", "Ecuador", "Sri Lanka", "Belarus", 
      "Madagascar", "Guatemala", "Luxembourg", "Azerbaijan", "Kyrgyzstan", 
      "Liechtenstein", "Turkmenistan"
    ],
  };
  

  useEffect(() => {
    generateAnagram();
  }, [difficulty]);

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
      setMessage("Incorrect! Try again.");
    }
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

      {difficulty === "hard" || difficulty === "expert" ? (
        <button onClick={getHint} className="hint-button">Get a Hint</button>
      ) : null}

      {hint && <p className="hint">Hint: {hint}</p>}

      <button onClick={generateAnagram} className="next-button">Next Word</button>
    </div>
  );
};

export default App;
