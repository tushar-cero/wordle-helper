import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  className?: string;
};

export const Cell: React.FC<Props> = ({
  value,
  onChange,
  maxLength = 1,
  className,
}) => {
  return (
    <input
      value={value}
      onChange={(e) => {
        const v = e.target.value
          .replace(/[^a-zA-Z]/g, "")
          .slice(0, maxLength)
          .toLowerCase();
        onChange(v);
      }}
      maxLength={maxLength}
      className={
        "w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold uppercase border rounded " +
        "focus:outline-none focus:ring focus:ring-blue-300 " +
        (className ?? "")
      }
    />
  );
};
