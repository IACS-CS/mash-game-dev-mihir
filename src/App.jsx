import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // State variables
  const [anagram, setAnagram] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [timer, setTimer] = useState(30); // 30 seconds for timed mode
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hint, setHint] = useState('');
  
  // Predefined word lists for different difficulties with country names
const wordLists = {
  easy: ['USA', 'Canada', 'India', 'Japan', 'China', 'Brazil', 'Italy', 'Spain'],
  medium: ['Mexico', 'Russia', 'Australia', 'Germany', 'Argentina', 'France', 'Nigeria'],
  hard: ['Portugal', 'Thailand', 'Poland', 'Vietnam', 'Sweden', 'Finland', 'Hungary'],
  expert: ['Iceland', 'Zimbabwe', 'Kazakhstan', 'Ecuador', 'Slovenia', 'Sri Lanka', 'Belarus']
};


  // Randomly pick an anagram based on difficulty
  useEffect(() => {
    const wordList = wordLists[difficulty];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const shuffledWord = randomWord.split('').sort(() => Math.random() - 0.5).join('');
    setAnagram(shuffledWord);
    setAnswer(randomWord);
  }, [difficulty]);

  // Timer countdown
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      alert('Time’s up!');
      resetGame();
    }
  }, [isTimerActive, timer]);

  // Handle answer submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.toLowerCase() === e.target.elements.answer.value.toLowerCase()) {
      setScore(score + 10); // Add points for correct answer
      alert('Correct!');
      resetGame();
    } else {
      alert('Try again!');
      nextWord();
    }
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  // Get next word
  const nextWord = () => {
    const wordList = wordLists[difficulty];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const shuffledWord = randomWord.split('').sort(() => Math.random() - 0.5).join('');
    setAnagram(shuffledWord);
    setAnswer(randomWord);
  };

  // Reset the game
  const resetGame = () => {
    setTimer(30);
    setIsTimerActive(false);
    setHint('');
    nextWord();
  };

  // Handle hint for harder levels
  const handleHint = () => {
    if (difficulty === 'hard' || difficulty === 'expert') {
      const letterToReveal = answer.split('').find((letter, index) => hint[index] === undefined);
      if (letterToReveal) {
        setHint(prevHint => prevHint + letterToReveal);
      }
    }
  };

  return (
    <div className="game-container">
      <h1 className="title">Anagram Adventure</h1>
      
      <div className="game-settings">
        <select onChange={handleDifficultyChange} value={difficulty}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        
        <button onClick={() => setIsTimerActive(true)} className="start-button">Start Game</button>
        <div className="score-board">
          <p>Score: {score}</p>
          <p>Time left: {timer}s</p>
        </div>
      </div>

      <div className="anagram-display">
        <h2> {anagram}</h2>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          name="answer"
          placeholder="Your Answer"
          required
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {difficulty === 'hard' || difficulty === 'expert' ? (
        <button onClick={handleHint} className="hint-button" disabled={hint.length === answer.length}>Hint</button>
      ) : null}

      <div className="hint-display">
        {hint && <p>Hint: {hint}</p>}
      </div>
    </div>
  );
};

export default App;
