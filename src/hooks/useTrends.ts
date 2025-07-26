import { useEffect, useState, useRef } from "react";

export type TrendPoint = {
  year: number;
  [word: string]: number | number[];
};

export function useTrends(words: string[], baseUrl = "") {
  const [data, setData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordsKey = words.filter(Boolean).join(",");
  const prevKey = useRef<string>("");

  useEffect(() => {
    if (!wordsKey || wordsKey === prevKey.current) return;
    prevKey.current = wordsKey;

    const controller = new AbortController();
    async function run() {
      try {
        setLoading(true);
        setError(null);
        // const query = encodeURIComponent(wordsKey);
        const url = `https://localhost:8000/ngrams?content=${wordsKey}&year_start=2017&year_end=2025&corpus=26&smoothing=1&case_insensitive=true`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload: Array<{ ngram: string; timeseries: number[] }> =
          await res.json();

        const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
        const chart = years.map((year, idx) => {
          const row: TrendPoint = { year } as TrendPoint;
          payload.forEach((p) => {
            row[p.ngram] = p.timeseries?.[idx] ?? 0;
          });
          return row;
        });
        setData(chart);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setError(e.message ?? "Failed to fetch trend data");
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => controller.abort();
  }, [wordsKey, baseUrl]);

  return { data, loading, error };
}
