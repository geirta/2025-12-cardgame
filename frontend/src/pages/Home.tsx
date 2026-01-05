import { useEffect, useState } from "react";
import type { Card } from "../models/Card";
import type { Result } from "../models/Result";
import type { GuessResponse } from "../models/GuessResponse";
import '../App.css'
import Leaderboard from "../components/Leaderboard";

const backendUrl = import.meta.env.VITE_API_HOST;

function Home() {
  const [baseCard, setBaseCard] = useState<Card | null>(null);
  const [seconds, setSeconds] = useState(10);
  const [guessResponse, setGuessResponse] = useState<GuessResponse | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  //const [timerLabel, setTimerLabel] = useState<number | string>(10);
  //const timerLabel = seconds > 0 ? seconds : "Time out!";

  const score = guessResponse?.score ?? 0;
  const lives = guessResponse?.lives ?? 3;
  const lastGuessStatus = guessResponse?.status; // CORRECT, WRONG, GAME_OVER, TIME_OUT

  type SortKey = "playerName" | "score" | "timePlayed";
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });


  useEffect(() => {
    if (!baseCard || lastGuessStatus === "GAME_OVER" || lastGuessStatus === "TIME_OUT") return;
    const intervalId = setInterval(() => {setSeconds(prev => prev-1)}, 1000);
    return () => clearInterval(intervalId);
  }, [baseCard, lastGuessStatus]);

  useEffect(() => {
    fetch(`${backendUrl}/results`)
      .then(res => res.json())
      .then(json => setResults(json))
  }, []);

  const startRound = async () => {
    const res = await fetch(`${backendUrl}/start`, {
      method: "POST",
      credentials: "include"
    });
    const data: Card = await res.json();
    setBaseCard(data);
    setSeconds(10);
    setGuessResponse(null);
  };

  const submitGuess = async (guess: "NONE" | "LOWER" | "EQUAL" | "HIGHER") => {
    const res = await fetch(`${backendUrl}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({guess})
    });

    if (!res.ok) {
      return;
    }

    const data: GuessResponse = await res.json();
    setGuessResponse(data);

    if (data.status === "CORRECT" || data.status === "WRONG") {
      setBaseCard({
        cardName: data.nextCardName!,
        strength: data.nextStrength!
      });
      setSeconds(10);
    }
  }

  const saveResult = async () => {
    if (playerName.length === 0) return;

    const res = await fetch(`${backendUrl}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: playerName
    });

    if (!res.ok) {
      return;
    }
    console.log("Score saved:", score);
    loadResults();
    setPlayerName("");
  };

  const loadResults = () => {
    fetch(`${backendUrl}/results`)
      .then(res => res.json())
      .then(json => setResults(json))
      .catch(console.error);
  };

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    if (seconds === 0 && baseCard) {
      const timer = setTimeout(() => {
        submitGuess("NONE"); // safely called asynchronously
      }, 0);
      return () => clearTimeout(timer); // cleanup just in case
    }
  }, [seconds, baseCard]);

  const timerDisplay = seconds > 0 
    ? seconds 
    : guessResponse?.status === "TIME_OUT" 
      ? "Time out!" 
      : "Game over!";
  
  return (
    <div>

      <div className="gameSection">
        {!baseCard
          ? <div className="gameStart">
              <h1>Hi-Lo card game</h1>
              <button onClick={startRound}>Start Game</button>
            </div>
          : <div>
              {lastGuessStatus === "GAME_OVER" || lastGuessStatus === "TIME_OUT" 
                ? <div className="gameEnd">
                    <h1>Game ended!</h1>
                    <h2>Final Score: {score}</h2>
                    <div>
                      <label>Name</label>
                      <input value={playerName} onChange={e => setPlayerName(e.target.value)}></input><br/>
                    </div>
                    <button onClick={saveResult} disabled={playerName.length === 0}>Save Score</button>
                    <button onClick={startRound}>New Game</button>
                  </div>
                : <div>
                    <h1>{timerDisplay}</h1>
                    <h2>Score: {score} | Lives: {lives}</h2>
                    <div className="cardsRow">
                      <div className="playCard baseCard">
                        <h3>Base card</h3>
                        <h1>{baseCard.strength}</h1>
                        <div>{baseCard.cardName}</div>
                      </div>
                      <div className="playCard">
                        <h3>Next card</h3>
                        <button onClick={() => submitGuess("LOWER")}>Lower</button>
                        <button onClick={() => submitGuess("EQUAL")}>Equal</button>
                        <button onClick={() => submitGuess("HIGHER")}>Higher</button>
                      </div>
                    </div>
                    <div>{lastGuessStatus}</div>
                  </div>
              }
            </div>
        }
      </div>
      
      
      <div className="leaderBoard">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("playerName")}>
                Name {sortKey === "playerName" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("score")}>
                Score {sortKey === "score" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("timePlayed")}>
                Duration {sortKey === "timePlayed" ? (sortDir === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map(res => (
              <tr key={res.id}>
                <td>{res.playerName}</td>
                <td>{res.score}</td>
                <td>{res.timePlayed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Leaderboard />
      
    </div>
  )
}

export default Home
