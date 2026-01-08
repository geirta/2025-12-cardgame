
import type { Result } from "../models/Result";
import { useState } from "react";

const backendUrl = import.meta.env.VITE_API_HOST;

type SortKey = "score" | "timePlayed";

type ScoreboardProps = {
  results: Result[],
  page: number,
  totalPages: number,
  onPageChange: (page:number) => void,
  onSizeChange: (size:number) => void,
  sortKey: SortKey,
  sortDir: "asc" | "desc",
  onSortChange: (key:SortKey) => void
};

function Scoreboard({results, page, totalPages, onPageChange, onSizeChange, sortKey, sortDir, onSortChange}: ScoreboardProps) {

  const [playerResults, setPlayerResults] = useState<Result[] | null>(null);

  const viewPlayer = async (playerId: number) => {
    const res = await fetch(`${backendUrl}/results/${playerId}`);
    const data: Result[] = await res.json();
    setPlayerResults(data);
  }

  const displayedResults = playerResults ?? results;

  function resetTable() {
    setPlayerResults(null)
  }

  return (

    <div className="scoreBoard">

      <h2>Scoreboard</h2>
      <table>
        <thead className="scoreBoardHeader">
          <tr>
            <th >
              Name
            </th>
            <th onClick={() => onSortChange("score")}>
              Score {sortKey === "score" ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => onSortChange("timePlayed")}>
              Duration (s) {sortKey === "timePlayed" ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedResults.map(res => (
            <tr key={res.id} onClick={() => viewPlayer(res.player.id)}>
              <td>{res.player.name}</td>
              <td>{res.score}</td>
              <td>{res.timePlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="scoreBoardFooter">

        {playerResults === null 
          ? <div className="scoreBoardFooterActions">
              <div>
                Display 
                <select onChange={e => onSizeChange(Number(e.target.value))}>
                  <option>5</option>
                  <option>10</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              <div>
                <button disabled={page === 0} onClick={() => onPageChange(page - 1)}>Eelmine</button>
                  <span>{page+1}</span>
                <button disabled={page+1 === totalPages} onClick={() => onPageChange(page + 1)}>Järgmine</button>
              </div>
            </div> 
          : <button onClick={resetTable}>Back</button>
        }

        
      </div>
    </div>
  )
}

export default Scoreboard
