import Scoreboard from "../components/Scoreboard";
import Game from "../components/Game";
import { useEffect, useState } from "react";
import type { Result } from "../models/Result";

const backendUrl = import.meta.env.VITE_API_HOST;

function Home() {

  const [results, setResults] = useState<Result[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [sortKey, setSortKey] = useState<"score" | "timePlayed">("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchResults = async () => {
    try {
      const res = await fetch(`${backendUrl}/results?page=${page}&size=${size}&sort=${sortKey},${sortDir}`);
      const json = await res.json();
      setResults(json.content ?? []);
      setTotalPages(json.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [page, size, sortKey, sortDir]);

  return (
    <div>
      <Game onResultSaved={fetchResults} />
      <Scoreboard 
        results={results}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setSize(newSize);
          setPage(0);
        }}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={(key) => {
          if (key===sortKey) {
            setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
          } else {
            setSortKey(key);
            setSortDir("desc");
          }
          setPage(0);
        }}
      />
    </div>
  )
}

export default Home
