import { useEffect, useState } from "react";
import type { Card } from "../models/Card";
import type { GuessResponse } from "../models/GuessResponse";
import '../App.css'

const backendUrl = import.meta.env.VITE_API_HOST;

type GameProps = {
  onResultSaved: () => void;
}

function Game({onResultSaved}: GameProps) {

  const [baseCard, setBaseCard] = useState<Card | null>(null);
  const [seconds, setSeconds] = useState(10);
  const [guessResponse, setGuessResponse] = useState<GuessResponse | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [lastGuess, setLastGuess] = useState<"LOWER" | "EQUAL" | "HIGHER" | null>(null);
  const [guessFlash, setGuessFlash] = useState<"correct" | "wrong" | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const score = guessResponse?.score ?? 0;
  const lives = guessResponse?.lives ?? 3;
  const lastGuessStatus = guessResponse?.status; // CORRECT, WRONG, GAME_OVER, TIME_OUT

  useEffect(() => {
    if (!baseCard || lastGuessStatus === "GAME_OVER" || lastGuessStatus === "TIME_OUT" || isPaused) return;
    const intervalId = setInterval(() => {
      setSeconds(prev => prev-1)
    }, 1000);
    return () => clearInterval(intervalId);
  }, [baseCard, lastGuessStatus, isPaused]);

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
    if (isPaused) return;
    if (guess !== "NONE") {
      setLastGuess(guess);
    }
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

    if (data.status === "CORRECT") {
      setGuessFlash("correct");
    } else if (data.status === "WRONG") {
      setGuessFlash("wrong");
    }

    if (data.status === "CORRECT" || data.status === "WRONG") {
      setIsPaused(true);
      setTimeout(() => {
        setGuessFlash(null);
        setLastGuess(null);
        setIsPaused(false);
        setBaseCard({
          cardName: data.nextCardName!,
          strength: data.nextStrength!
        });
        setSeconds(10);
    }, 2000);

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
    onResultSaved();
    setPlayerName("");
  };


  useEffect(() => {
    if (seconds === 0 && baseCard) {
      const timer = setTimeout(() => {
        submitGuess("NONE");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [seconds, baseCard]);

  const timerDisplay = seconds > 0 
    ? seconds 
    : guessResponse?.status === "TIME_OUT" 
      ? "Time out!" 
      : "Game over!";


  return (
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
                      <button 
                        className={`guessBtn ${lastGuess === "LOWER"
                            ? guessFlash === "correct"
                              ? "btn-correct"
                              : guessFlash === "wrong"
                                ? "btn-wrong"
                                : ""
                            : ""
                        }`} 
                        onClick={() => submitGuess("LOWER")}
                        disabled={isPaused}
                      >Lower</button>
                      <button 
                        className={`guessBtn ${lastGuess === "EQUAL"
                            ? guessFlash === "correct"
                              ? "btn-correct"
                              : guessFlash === "wrong"
                                ? "btn-wrong"
                                : ""
                            : ""
                        }`}
                        onClick={() => submitGuess("EQUAL")}
                        disabled={isPaused}
                      >
                        Equal
                      </button>
                      <button
                        className={`guessBtn ${lastGuess === "HIGHER"
                            ? guessFlash === "correct"
                              ? "btn-correct"
                              : guessFlash === "wrong"
                                ? "btn-wrong"
                                : ""
                            : ""
                        }`}
                        onClick={() => submitGuess("HIGHER")}
                        disabled={isPaused}
                      >Higher</button>
                    </div>
                  </div>
                  <h2>
                    {guessFlash !== null && guessResponse && (
                      <>
                        {guessResponse.nextStrength}
                        <br/>
                        {guessResponse.nextCardName}
                      </>
                    )}
                  </h2>
                </div>
            }
          </div>
      }
    </div>
  )
}

export default Game
