"use client";
import { useEffect, useState } from "react";

type FractionInputProps = {
  Offset: number;
  setOffset: (value: number) => void;
};

const FractionInput: React.FC<FractionInputProps> = ({ Offset, setOffset }) => {
  const [whole, setWhole] = useState<number>(Math.floor(Offset));
  const [numerator, setNumerator] = useState<number>(0);
  const [denominator, setDenominator] = useState<number>(1);

  useEffect(() => {
    if (denominator === 0) return;
    const fractionValue = whole + numerator / denominator;
    setOffset(fractionValue);
  }, [whole, numerator, denominator, setOffset]);

  return (
    <div className="flex items-center gap-4">
      <label className="pr-4">Offset:</label>

      {/* Whole number input */}
      <input
        type="number"
        value={whole}
        onChange={(e) => setWhole(parseInt(e.target.value) || 0)}
        className="w-16 border-2 p-2"
        placeholder="Whole"
      />

      {/* Fraction box */}
      <div className="flex flex-col items-center">
        <input
          type="number"
          value={numerator}
          onChange={(e) => setNumerator(parseInt(e.target.value) || 0)}
          className="w-12 border-2 p-1 text-center"
          placeholder="Num"
        />
        <hr className="w-full border-black" />
        <input
          type="number"
          value={denominator}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setDenominator(val === 0 ? 1 : val); // Prevent zero
          }}
          className="w-12 border-2 p-1 text-center"
          placeholder="Den"
        />
      </div>
    </div>
  );
};

export default FractionInput;
