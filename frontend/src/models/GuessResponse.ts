
export type GuessResponse = {
  status: "TIME_OUT" | "GAME_OVER" | "CORRECT" | "WRONG"
  nextCardName: string,
  nextStrength: number,
  score: number,
  lives: number
}