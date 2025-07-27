import React, { useEffect, useMemo, useState } from "react";
import { filterWords, Letter } from "./utils";
import { WordRow } from "./components/wordRow";
import { Cell } from "./components/cell";

import { useTrends } from "./hooks/useTrends";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const EXCLUDED_MAX = 20;

function App() {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [correct, setCorrect] = useState<Letter[]>(Array(5).fill(null));
  const [wrong, setWrong] = useState<Letter[]>(Array(5).fill(null));
  const [excludedLetters, setExcludedLetters] = useState<string[]>(
    Array(EXCLUDED_MAX).fill("")
  );

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch(
          "https://cheaderthecoder.github.io/5-Letter-words/words.json"
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAllWords(data.words.map((w) => w.toLowerCase()));
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Failed to fetch words");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  const excludedSet = useMemo(
    () =>
      new Set(excludedLetters.filter(Boolean).join("").toLowerCase().split("")),
    [excludedLetters]
  );

  const isEmptyFilters = useMemo(() => {
    const hasCorrect = correct.some((c) => c !== null && c !== "");
    const hasWrong = wrong.some((c) => c !== null && c !== "");
    const hasExcluded = excludedLetters.some((c) => c !== "");
    return !(hasCorrect || hasWrong || hasExcluded);
  }, [correct, wrong, excludedLetters]);

  const results = useMemo(() => {
    if (loading || error || isEmptyFilters) return [];
    return filterWords(allWords, correct, wrong, excludedSet);
  }, [allWords, correct, wrong, excludedSet, loading, error, isEmptyFilters]);

  const topWords = results.slice(0, 5);
  const {
    data: trendData,
    loading: trendLoading,
    error: trendError,
  } = useTrends(topWords);

  const updateCorrect = (i: number, v: string) => {
    const next = [...correct];
    next[i] = v ? v[0] : null;
    setCorrect(next);
  };

  const updateWrong = (i: number, v: string) => {
    const next = [...wrong];
    next[i] = v ? v[0] : null;
    setWrong(next);
  };

  const updateExcluded = (i: number, v: string) => {
    const next = [...excludedLetters];
    next[i] = v ? v[0] : "";
    setExcludedLetters(next);
  };

  const clearAll = () => {
    setCorrect(Array(5).fill(null));
    setWrong(Array(5).fill(null));
    setExcludedLetters(Array(EXCLUDED_MAX).fill(""));
  };

  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Wordle Butler</h1>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            Clear
          </button>
        </header>

        <section className="flex flex-col gap-6 bg-white rounded-lg shadow p-4 md:p-6">
          <WordRow
            label="Correct spots"
            size={5}
            cells={correct.map((c) => c ?? "")}
            onChange={updateCorrect}
            colorClass="bg-green-100"
            helper="Letters in the correct positions."
          />

          <WordRow
            label="Wrong spots"
            size={5}
            cells={wrong.map((c) => c ?? "")}
            onChange={updateWrong}
            colorClass="bg-yellow-100"
            helper="Letters that are in the word but NOT at these positions."
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-semibold">
                Not in word
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: EXCLUDED_MAX }).map((_, i) => (
                <Cell
                  key={i}
                  value={excludedLetters[i] ?? ""}
                  onChange={(v) => updateExcluded(i, v)}
                  className="bg-gray-100"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-4 md:p-6">
          {loading && <p>Loading words…</p>}
          {error && (
            <p className="text-red-600">
              Could not load words: {error}. (You can refresh and try again.)
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">Matches</h2>
                <span className="text-sm text-gray-500">
                  {results.length} results found
                </span>
              </div>

              {isEmptyFilters ? (
                <p className="text-gray-400">
                  Enter some constraints to see matches.
                </p>
              ) : results.length === 0 ? (
                <p className="text-gray-500">
                  No matches. Adjust your constraints.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {results.map((w) => (
                    <span
                      key={w}
                      className="px-2 py-1 rounded bg-blue-50 border text-sm font-mono"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {!isEmptyFilters && (
          <section className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="font-semibold text-lg mb-3">
              Word Trends (2021-2025)
            </h2>
            {trendLoading && <p>Loading trend data…</p>}
            {trendError && (
              <p className="text-red-600">
                Unable to fetch trend data at the moment
              </p>
            )}
            {!trendLoading && !trendError && trendData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[...trendData].sort((a, b) => a.year - b.year)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(trendData[0])
                    .filter((k) => k !== "year" && results.includes(k))
                    .map((word, idx) => (
                      <Line
                        key={word}
                        type="monotone"
                        dataKey={word}
                        stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
