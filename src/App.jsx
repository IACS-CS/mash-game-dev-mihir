import React, { useState, useEffect } from "react";
import "./App.css"; // Importing CSS for styling

// Main App Component
const App = () => {
  // Game states
  const [anagram, setAnagram] = useState(""); // Current scrambled word
  const [answer, setAnswer] = useState(""); // Correct answer for the anagram
  const [userInput, setUserInput] = useState(""); // User's guess
  const [score, setScore] = useState(0); // Player's current score
  const [difficulty, setDifficulty] = useState("easy"); // Current difficulty level
  const [hint, setHint] = useState(""); // Current hint for the word
  const [message, setMessage] = useState(""); // Feedback message (correct/incorrect)
  const [gameStarted, setGameStarted] = useState(false); // Whether the game has started
  const [lastWord, setLastWord] = useState(""); // Last word to avoid repeats
  const [hintsUsed, setHintsUsed] = useState(0); // Track hints used by player
  const [leaderboard, setLeaderboard] = useState(() =>
    JSON.parse(localStorage.getItem("leaderboard")) || []
  ); // Load leaderboard from localStorage
  const [showLeaderboard, setShowLeaderboard] = useState(false); // Show or hide leaderboard

  // Word lists for each difficulty level
  const wordLists = {
    easy: [
      "USA", "INDIA", "CHINA", "BRAZIL", "ITALY", "SPAIN", 
      "JAPAN", "EGYPT", "CHILE", "PERU", "CUBA", "IRAN",
      "NEPAL", "OMAN", "FIJI", "QATAR", "MALTA", "CHAD",
    ],
    medium: [
      "RUSSIA", "MEXICO", "GERMANY", "NIGERIA", "FRANCE", 
      "CANADA", "TURKEY", "SWEDEN", "POLAND", "GREECE", 
      "NORWAY", "ARGENTINA", "BELGIUM", "AUSTRIA", "SERBIA",
      "KENYA", "ANGOLA", "LIBYA", "GABON", "JAMAICA",
    ],
    hard: [
      "PORTUGAL", "THAILAND", "VIETNAM", "HUNGARY", "FINLAND", 
      "MALAYSIA", "PHILIPPINES", "COLOMBIA", "UKRAINE", 
      "SINGAPORE", "MOROCCO", "CROATIA", "BULGARIA", "SLOVAKIA",
      "LITHUANIA", "LATVIA", "ESTONIA", "JORDAN", "ALBANIA",
    ],
    expert: [
      "ZIMBABWE", "KAZAKHSTAN", "ECUADOR", "SRI LANKA", "BELARUS", 
      "MADAGASCAR", "GUATEMALA", "LUXEMBOURG", "AZERBAIJAN", 
      "KYRGYZSTAN", "LIECHTENSTEIN", "TURKMENISTAN", "TAJIKISTAN",
      "UZBEKISTAN", "MAURITANIA", "EQUATORIAL GUINEA", "ESWATINI",
      "DJIBOUTI", "BURKINA FASO",
    ],
  };

  // Start a new game or reset the game
  const startGame = () => {
    setGameStarted(true);
    setScore(0); // Reset score
    setHintsUsed(0); // Reset hints
    generateAnagram(); // Generate the first anagram
  };

  // Generate a new anagram
  const generateAnagram = () => {
    const wordList = wordLists[difficulty]; // Select word list based on difficulty
    let randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    // Avoid repeating the last word
    while (randomWord === lastWord) {
      randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    }

    setAnagram(shuffleWord(randomWord)); // Scramble the word
    setAnswer(randomWord); // Save the correct answer
    setLastWord(randomWord); // Update last word
    setHint(""); // Reset the hint
    setUserInput(""); // Clear user input
    setMessage(""); // Clear feedback message
  };

  // Shuffle the letters of a word
  const shuffleWord = (word) => {
    const wordArray = word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    return wordArray.join("");
  };

  // Handle the form submission when user submits a guess
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim().toUpperCase() === answer.toUpperCase()) {
      // Correct answer
      let points = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : difficulty === "hard" ? 20 : 30;
      setScore((prev) => prev + points); // Add points to score
      setMessage("Correct! Well done!");
      generateAnagram(); // Generate a new word
    } else {
      // Incorrect answer
      handleWrongAnswer();
    }
  };

  // Handle incorrect answers
  const handleWrongAnswer = () => {
    setScore((prev) => (prev >= 10 ? prev - 10 : 0)); // Deduct points, minimum 0
    setMessage("Incorrect! Try again.");
    generateAnagram(); // Generate a new word after incorrect answer
  };

  // Provide a hint for the current word (only for hard and expert)
  const getHint = () => {
    if (["hard", "expert"].includes(difficulty)) {
      if (hintsUsed < 3 && hint.length < answer.length) {
        setHintsUsed((prev) => prev + 1); // Increment hints used
        setHint(answer.slice(0, hint.length + 1)); // Reveal one more letter
      } else {
        setMessage("No more hints available!"); // If all hints are used
      }
    } else {
      setMessage("Hints are not available for this difficulty level!");
    }
  };

  // Save the leaderboard to localStorage
  const saveToLeaderboard = () => {
    const name = prompt("Enter your name for the leaderboard:");
    const newEntry = { name, score };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 5);
    setLeaderboard(updatedLeaderboard); // Update leaderboard
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard)); // Save to localStorage
  };

  // Use useEffect to regenerate anagram whenever difficulty changes
  useEffect(() => {
    if (gameStarted) {
      generateAnagram(); // Regenerate the anagram when difficulty changes
    }
  }, [difficulty]); // Runs whenever difficulty is changed

  // JSX to render the game interface
  return (
    <div className="game-container">
      <h1>Country Anagram Game</h1>
      <p>Score: {score}</p>

      {!gameStarted ? (
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
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

          {["hard", "expert"].includes(difficulty) && (
            <button onClick={getHint} className="hint-button">
              Get a Hint
            </button>
          )}
          {hint && <p className="hint">Hint: {hint}</p>}

          <button onClick={generateAnagram} className="next-button">
            Next Word
          </button>
        </>
      )}

      <button
        onClick={() => setShowLeaderboard((prev) => !prev)}
        className="leaderboard-button"
      >
        {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
      </button>

      {showLeaderboard && (
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={index}>
                {entry.name}: {entry.score}
              </li>
            ))}
          </ul>
        </div>
      )}

      {gameStarted && (
        <button onClick={saveToLeaderboard} className="save-button">
          Save Score
        </button>
      )}
    </div>
  );
};

export default App;
