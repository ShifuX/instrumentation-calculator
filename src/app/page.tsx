"use client";
import { useState } from "react";
import "./components/calculator";
import Calculator from "./components/calculator";
import Tube from "./components/tube";

interface Marker {
  inches: number;
  label: string;
  name: string;
}

// need to grab the original center line and put the lines relative to that on the tube
export default function Home() {
  const [markers, setMarkers] = useState<Marker[]>([
    { inches: 0.25, label: "1/4", name: "newCenterLine" },
    { inches: 0.5, label: "1/2", name: "travel" },
    { inches: 1.75, label: "1 3/4", name: "halfAngleLine" },
    { inches: 3.0, label: "3", name: "fullAngleLine" },
  ]);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Calculator onMarkersChange={setMarkers} />
      <p>Currently measurements are being taken from right to left</p>
      <Tube lengthInInches={12} markers={markers} />
    </div>
  );
}
