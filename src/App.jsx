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

  // Word lists for each difficulty level
  const wordLists = {
    easy: [
      "USA", "INDIA", "CHINA", "BRAZIL", "ITALY", "SPAIN", "JAPAN", "EGYPT", 
      "CHILE", "PERU", "CUBA", "IRAN", "NEPAL", "OMAN", "FIJI", "QATAR", 
      "MALTA", "CHAD", "KENYA", "ARGENTINA", "SOUTH KOREA", "MEXICO", "SINGAPORE"
    ],
    medium: [
      "RUSSIA", "MEXICO", "GERMANY", "NIGERIA", "FRANCE", "CANADA", "TURKEY", 
      "SWEDEN", "POLAND", "GREECE", "NORWAY", "ARGENTINA", "BELGIUM", "AUSTRIA", 
      "SERBIA", "KENYA", "ANGOLA", "LIBYA", "GABON", "JAMAICA", "HUNGARY", 
      "COLOMBIA", "TUNISIA", "PHILIPPINES"
    ],
    hard: [
      "PORTUGAL", "THAILAND", "VIETNAM", "HUNGARY", "FINLAND", "MALAYSIA", 
      "PHILIPPINES", "COLOMBIA", "UKRAINE", "SINGAPORE", "MOROCCO", "CROATIA", 
      "BULGARIA", "SLOVAKIA", "LITHUANIA", "LATVIA", "ESTONIA", "JORDAN", 
      "ALBANIA", "ROMANIA", "BOLIVIA", "NEPAL", "ZAMBIA", "CAMBODIA"
    ],
    expert: [
      "ZIMBABWE", "KAZAKHSTAN", "ECUADOR", "SRI LANKA", "BELARUS", "MADAGASCAR", 
      "GUATEMALA", "LUXEMBOURG", "AZERBAIJAN", "KYRGYZSTAN", "LIECHTENSTEIN", 
      "TURKMENISTAN", "TAJIKISTAN", "UZBEKISTAN", "MAURITANIA", "EQUATORIAL GUINEA", 
      "ESWATINI", "DJIBOUTI", "BURKINA FASO", "PARAGUAY", "SUDAN", "MALAWI", 
      "MONACO", "MALDIVES", "SAN MARINO"
    ],
    allCountries: [
      "USA", "INDIA", "CHINA", "BRAZIL", "ITALY", "SPAIN", "JAPAN", "EGYPT", 
      "RUSSIA", "MEXICO", "GERMANY", "NIGERIA", "FRANCE", "CANADA", "TURKEY", 
      "SWEDEN", "POLAND", "GREECE", "NORWAY", "ARGENTINA", "BELGIUM", "AUSTRIA", 
      "SERBIA", "KENYA", "ANGOLA", "LIBYA", "GABON", "JAMAICA", "HUNGARY", 
      "COLOMBIA", "TUNISIA", "PHILIPPINES", "PORTUGAL", "THAILAND", "VIETNAM", 
      "HUNGARY", "FINLAND", "MALAYSIA", "PHILIPPINES", "COLOMBIA", "UKRAINE", 
      "SINGAPORE", "MOROCCO", "CROATIA", "BULGARIA", "SLOVAKIA", "LITHUANIA", 
      "LATVIA", "ESTONIA", "JORDAN", "ALBANIA", "ROMANIA", "BOLIVIA", "NEPAL", 
      "ZAMBIA", "CAMBODIA", "ZIMBABWE", "KAZAKHSTAN", "ECUADOR", "SRI LANKA", 
      "BELARUS", "MADAGASCAR", "GUATEMALA", "LUXEMBOURG", "AZERBAIJAN", "KYRGYZSTAN", 
      "LIECHTENSTEIN", "TURKMENISTAN", "TAJIKISTAN", "UZBEKISTAN", "MAURITANIA", 
      "EQUATORIAL GUINEA", "ESWATINI", "DJIBOUTI", "BURKINA FASO", "PARAGUAY", 
      "SUDAN", "MALAWI", "MONACO", "MALDIVES", "SAN MARINO"
    ]
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
    const wordArray = word.split(""); // Split the word into an array of characters
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; // Swap characters
    }
    return wordArray.join(""); // Join the array back into a word
  };

  // Handle the form submission when user submits a guess
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (userInput.trim().toUpperCase() === answer.toUpperCase()) { // Check if guess is correct
      let points = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : difficulty === "hard" ? 20 : difficulty === "allCountries" ? 5 : 0;
      setScore((prev) => prev + points); // Add points to score
      setMessage("Correct! Well done!");
      generateAnagram(); // Generate a new word
    } else {
      handleWrongAnswer(); // Handle incorrect answer
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
    if (["hard", "expert"].includes(difficulty)) { // Only available for hard and expert difficulty
      if (hint.length < answer.length) { // If there are still letters to reveal
        setHintsUsed((prev) => prev + 1); // Increment hints used
        setHint(answer.slice(0, hint.length + 1)); // Reveal one more letter
      } else {
        setMessage("No more hints available!"); // If all hints are used
      }
    } else {
      setMessage("Hints are not available for this difficulty level!"); // Inform player if hints are not available
    }
  };

  // JSX to render the game interface
  return (
    <div className="game-container">
      <h1>Country Anagram Game</h1>
      <p>Score: {score}</p>
      {!gameStarted ? (
        <button onClick={startGame} className="start-button">Start Game</button> // Start button
      ) : (
        <>
          <div className="settings">
            <label htmlFor="difficulty">Difficulty: </label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
              <option value="allCountries">All Countries</option> {/* New option */}
            </select>
          </div>
          <div className="anagram-display">
            <p>Unscramble this: <strong>{anagram}</strong></p> {/* Display scrambled word */}
          </div>
          <form onSubmit={handleSubmit} className="input-form">
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Your guess" /> {/* Input for guess */}
            <button type="submit">Submit</button> {/* Submit button */}
          </form>
          {message && <p className="message">{message}</p>} {/* Show feedback message */}
          {["hard", "expert"].includes(difficulty) && (
            <button onClick={getHint} className="hint-button">Get a Hint</button> //* Button to get hint */}
          )}
          {hint && <p className="hint">Hint: {hint}</p>} {/* Show hint if available */}
          <button onClick={generateAnagram} className="next-button">Next Word</button> {/* Button to generate next word */}
        </>
      )}
    </div>
  );
};

export default App;
