"use client";
import { useState } from "react";

interface Marker {
  inches: number;
  label: string;
  name: string;
  relativeTo?: string;
  direction?: "left" | "right";
}

interface CalculatorProps {
  onMarkersChange: (markers: Marker[]) => void;
}

const Calculator = ({ onMarkersChange }: CalculatorProps) => {
  // will update this to select a bender radius option
  const BENDER_RADIUS = 1.5;
  const MULTIPLIER_HALF_ANGLE = 0.017455;
  const MULTIPLIER_FULL_ANGLE = 0.017452;

  const [Offset, setOffset] = useState<number>(0.0);
  const [Angle, setAngle] = useState<number>(0);
  const [Travel, setTravel] = useState<number>(0);
  const [Run, setRun] = useState<number>(0);

  const [DisplayTravel, setDisplayTravel] = useState<string>("0");
  const [DisplayNewCenter, setDisplayNewCenter] = useState<string>("0");
  const [DisplayHalfAngleLine, setDisplayHalfAngleLine] = useState<string>("0");
  const [DisplayFullAngleLine, setDisplayFullAngleLine] = useState<string>("0");

  function Calculate() {
    let travel = CalculateTravel();
    let run = CalculateRun(travel);
    let newCenter = CalculateNewCenter(travel, run);
    let halfAngleLine = CalculateHalfAngleLine();
    let fullAngleLine = CalculateFullAngleLine();

    let markers: Marker[] = [
      {
        inches: 4,
        label: "",
        name: "originalCenter",
      },
      {
        inches: newCenter,
        label: toMeasuringTapeFraction(newCenter),
        name: "newCenter",
        relativeTo: "originalCenter",
        direction: "left",
      },
      {
        inches: travel,
        label: toMeasuringTapeFraction(travel),
        name: "travel",
        relativeTo: "newCenter",
        direction: "right",
      },
      {
        inches: halfAngleLine,
        label: toMeasuringTapeFraction(halfAngleLine),
        name: "halfAngleLine",
        relativeTo: "travel",
        direction: "right",
      },
      {
        inches: fullAngleLine,
        label: toMeasuringTapeFraction(fullAngleLine),
        name: "fullAngleLine",
        relativeTo: "halfAngleLine",
        direction: "left",
      },
    ];

    onMarkersChange(markers);
  }

  function CalculateTravel(): number {
    let radians = (Angle * Math.PI) / 180;
    let travel = Offset / Math.sin(radians);
    setTravel(travel);
    setDisplayTravel(toMeasuringTapeFraction(travel));

    return travel;
  }

  function CalculateRun(travel: number): number {
    let radians = (Angle * Math.PI) / 180;
    let run = travel * Math.cos(radians);
    setRun(run);

    return run;
  }

  function CalculateNewCenter(travel: number, run: number): number {
    let newCenter = travel - run;
    setDisplayNewCenter(toMeasuringTapeFraction(newCenter));

    return newCenter;
  }

  // Will later use the benderRadius state variable
  function CalculateHalfAngleLine(): number {
    let halfAngleLine = MULTIPLIER_HALF_ANGLE * (Angle / 2) * BENDER_RADIUS;
    setDisplayHalfAngleLine(toMeasuringTapeFraction(halfAngleLine));

    return halfAngleLine;
  }

  function CalculateFullAngleLine(): number {
    let fullAngleLine = MULTIPLIER_FULL_ANGLE * Angle * BENDER_RADIUS;
    setDisplayFullAngleLine(toMeasuringTapeFraction(fullAngleLine));

    return fullAngleLine;
  }

  function toMeasuringTapeFraction(value: number): string {
    const denominator = 16;
    const whole = Math.floor(value);
    const fraction = value - whole;

    // Convert the fraction to the nearest 1/16
    let numerator = Math.round(fraction * denominator);

    // Adjust whole number if numerator rounds to 16 (i.e., 1)
    if (numerator === 16) {
      return `${whole + 1}`;
    }

    // Simplify the fraction
    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }

    const divisor = gcd(numerator, denominator);
    numerator /= divisor;
    const simplifiedDenominator = denominator / divisor;

    if (whole === 0 && numerator === 0) {
      return "0";
    }

    if (numerator === 0) {
      return `${whole}`;
    }

    if (whole === 0) {
      return `${numerator}/${simplifiedDenominator}`;
    }

    return `${whole} ${numerator}/${simplifiedDenominator}`;
  }

  return (
    <div>
      <label className="pr-4">Offset:</label>
      <input
        type="number"
        className=" border-2 p-2"
        defaultValue={Offset}
        onChange={(e) => setOffset(Number(e.target.value))}
      />

      <label className="pr-4">Angle:</label>
      <input
        type="number"
        className=" border-2 p-2"
        defaultValue={Angle}
        onChange={(e) => setAngle(Number(e.target.value))}
      />

      <button
        className="bg-blue-500 hover:bg-blue-400 p-2 rounded-full ml-4"
        onClick={Calculate}
      >
        Calculate
      </button>

      <p>Travel: {DisplayTravel}</p>
      <p>New Center: {DisplayNewCenter}</p>
      <p>Half Angle Line: {DisplayHalfAngleLine}</p>
      <p>Full Angle Line: {DisplayFullAngleLine}</p>
    </div>
  );
};

export default Calculator;
