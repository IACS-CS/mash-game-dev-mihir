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
  const [lastWord, setLastWord] = useState(""); // track the last used word

  // Word lists categorized by difficulty levels
  const wordLists = {
    easy: [
      "USA", "INDIA", "CHINA", "BRAZIL", "ITALY", "SPAIN", 
      "JAPAN", "EGYPT", "CHILE", "PERU", "CUBA", "IRAN",
      "NEPAL", "OMAN", "FIJI", "QATAR", "MALTA", "CHAD"
    ],
    medium: [
      "RUSSIA", "MEXICO", "GERMANY", "NIGERIA", "FRANCE", 
      "CANADA", "TURKEY", "SWEDEN", "POLAND", "GREECE", 
      "NORWAY", "ARGENTINA", "BELGIUM", "AUSTRIA", "SERBIA",
      "KENYA", "ANGOLA", "LIBYA", "GABON", "JAMAICA"
    ],
    hard: [
      "PORTUGAL", "THAILAND", "VIETNAM", "HUNGARY", "FINLAND", 
      "MALAYSIA", "PHILIPPINES", "COLOMBIA", "UKRAINE", 
      "SINGAPORE", "MOROCCO", "CROATIA", "BULGARIA", "SLOVAKIA",
      "LITHUANIA", "LATVIA", "ESTONIA", "JORDAN", "ALBANIA"
    ],
    expert: [
      "ZIMBABWE", "KAZAKHSTAN", "ECUADOR", "SRI LANKA", "BELARUS", 
      "MADAGASCAR", "GUATEMALA", "LUXEMBOURG", "AZERBAIJAN", 
      "KYRGYZSTAN", "LIECHTENSTEIN", "TURKMENISTAN", "TAJIKISTAN",
      "UZBEKISTAN", "MAURITANIA", "EQUATORIAL GUINEA", "ESWATINI",
      "DJIBOUTI", "BURKINA FASO"
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
    let randomWord = wordList[Math.floor(Math.random() * wordList.length)]; // pick a random word

    // Ensure that the new word is not the same as the last one used
    while (randomWord === lastWord) {
      randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    }

    const shuffledWord = shuffleWord(randomWord); // shuffle the word
    setAnagram(shuffledWord); // set the shuffled word as the anagram
    setAnswer(randomWord); // set the original word as the answer
    setLastWord(randomWord); // update the last used word
    setHint(""); // reset hint
    setUserInput(""); // reset user input
    setMessage(""); // reset feedback message
  };

  // Function to shuffle the word more effectively
  const shuffleWord = (word) => {
    const wordArray = word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; // Swap positions
    }
    return wordArray.join("");
  };

  // Function to handle form submission when the user submits their guess
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim().toUpperCase() === answer.toUpperCase()) { // Trim spaces and compare
      let points = 0;

      // Assign points based on difficulty
      if (difficulty === "easy") points = 10;
      if (difficulty === "medium") points = 15;
      if (difficulty === "hard") points = 20;
      if (difficulty === "expert") points = 30;

      setScore((prevScore) => prevScore + points); // increase score based on difficulty
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
