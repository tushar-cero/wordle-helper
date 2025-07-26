import React from "react";
import { Cell } from "./cell";

type Props = {
  label: string;
  size: number;
  cells: string[];
  onChange: (index: number, value: string) => void;
  colorClass: string; // e.g. bg-green-200, bg-yellow-200
  helper?: string;
};

export const WordRow: React.FC<Props> = ({
  label,
  size,
  cells,
  onChange,
  colorClass,
  helper,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start gap-0">
        <span className="text-lg md:text-base font-semibold">{label}</span>
        {helper && <span className="text-xs text-gray-500">{helper}</span>}
      </div>
      <div className="flex gap-2">
        {Array.from({ length: size }).map((_, i) => (
          <Cell
            key={i}
            value={cells[i] ?? ""}
            onChange={(v) => onChange(i, v)}
            className={colorClass}
          />
        ))}
      </div>
    </div>
  );
};
