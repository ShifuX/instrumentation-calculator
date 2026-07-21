"use client";
import { useState } from "react";
import FractionInput from "./fractioninput";

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
  //const BENDER_RADIUS = 1.5;
  const MULTIPLIER_HALF_ANGLE = 0.017455;
  const MULTIPLIER_FULL_ANGLE = 0.017452;

  const [Offset, setOffset] = useState<number>(0.0);
  const [Angle, setAngle] = useState<number>(0);
  const [Travel, setTravel] = useState<number>(0);
  const [Run, setRun] = useState<number>(0);
  const [BenderRadius, setBenderRadius] = useState<number>(1.5);

  const [DisplayTravel, setDisplayTravel] = useState<string>("0");
  const [DisplayNewCenter, setDisplayNewCenter] = useState<string>("0");
  const [DisplayHalfAngleLine, setDisplayHalfAngleLine] = useState<string>("0");
  const [DisplayFullAngleLine, setDisplayFullAngleLine] = useState<string>("0");

  function Calculate() {
    const travel = CalculateTravel();
    const run = CalculateRun(travel);
    const newCenter = CalculateNewCenter(travel, run);
    const halfAngleLine = CalculateHalfAngleLine();
    const fullAngleLine = CalculateFullAngleLine();

    const markers: Marker[] = [
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
    const radians = (Angle * Math.PI) / 180;
    const travel = Offset / Math.sin(radians);
    setTravel(travel);
    setDisplayTravel(toMeasuringTapeFraction(travel));

    return travel;
  }

  function CalculateRun(travel: number): number {
    const radians = (Angle * Math.PI) / 180;
    const run = travel * Math.cos(radians);
    setRun(run);

    return run;
  }

  function CalculateNewCenter(travel: number, run: number): number {
    const newCenter = travel - run;
    setDisplayNewCenter(toMeasuringTapeFraction(newCenter));

    return newCenter;
  }

  // Will later use the benderRadius state variable
  function CalculateHalfAngleLine(): number {
    const halfAngleLine = MULTIPLIER_HALF_ANGLE * (Angle / 2) * BenderRadius;
    setDisplayHalfAngleLine(toMeasuringTapeFraction(halfAngleLine));

    return halfAngleLine;
  }

  function CalculateFullAngleLine(): number {
    const fullAngleLine = MULTIPLIER_FULL_ANGLE * Angle * BenderRadius;
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

  // const parseFractionInput = (input: string) => {
  //   input = input.trim();
  //   if (!input) return 0;

  //   // Match formats: "1 1/2", "3/4", "2", etc.
  //   const parts = input.split(" ");

  //   let whole = 0;
  //   let fraction = 0;

  //   if (parts.length === 2) {
  //     whole = parseInt(parts[0], 10);
  //     const [numerator, denominator] = parts[1].split("/").map(Number);
  //     if (denominator) fraction = numerator / denominator;
  //   } else if (parts[0].includes("/")) {
  //     const [numerator, denominator] = parts[0].split("/").map(Number);
  //     if (denominator) fraction = numerator / denominator;
  //   } else {
  //     whole = parseFloat(parts[0]);
  //   }

  //   return whole + fraction;
  // };

  return (
    <div>
      <div className="flex flex-col gap-2">
        {/* Offset input using FractionInput component */}
        <FractionInput
          labelName="Offset"
          fractionalValue={Offset}
          setFractionalValue={setOffset}
        />
        {/* Angle input */}
        <label className="pr-4">Angle:</label>
        <input
          type="number"
          className=" border-2 p-2"
          defaultValue={Angle}
          onChange={(e) => setAngle(Number(e.target.value))}
        />
        {/*Bender Radius input using FractionInput component */}
        <FractionInput
          labelName="Bender Radius"
          fractionalValue={BenderRadius}
          setFractionalValue={setBenderRadius}
        />
        <button
          className="bg-blue-500 hover:bg-blue-400 p-2 rounded-full ml-4"
          onClick={Calculate}
        >
          Calculate
        </button>
      </div>
      /* New Center: Shrink, Half Angle: Setback, Full Angle: Arc Length */
      <div className="flex flex-col pt-10">
        <p>Travel: {DisplayTravel}</p>
        <p>Shrink: {DisplayNewCenter}</p>
        <p>Setback: {DisplayHalfAngleLine}</p>
        <p>Arc Length: {DisplayFullAngleLine}</p>
      </div>
    </div>
  );
};

export default Calculator;
