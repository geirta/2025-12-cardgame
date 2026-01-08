import type { Player } from "./Player"

export type Result = {
  id: number,
  score: number,
  player: Player,
  timePlayed: number
}