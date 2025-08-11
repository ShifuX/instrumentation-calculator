interface Marker {
  inches: number;
  label: string;
  name?: string;
  relativeTo?: string;
  direction?: "left" | "right";
}

interface TubeProps {
  lengthInInches: number;
  markers: Marker[];
}

const TAPE_LENGTH_INCHES = 12;

// fix css for line/label positioning

const Tube = ({ lengthInInches, markers }: TubeProps) => {
  const nameMap = Object.fromEntries(markers.map((m) => [m.name, m]));

  const getPositionInInches = (marker: Marker): number => {
    if (marker.relativeTo) {
      const base = nameMap[marker.relativeTo];
      if (!base) return marker.inches;

      const baseInches = getPositionInInches(base);
      const direction = marker.direction || "right";

      return direction === "left"
        ? baseInches - marker.inches
        : baseInches + marker.inches;
    }

    return marker.inches;
  };

  return (
    <div className="relative w-full h-40">
      <div className="absolute top-1/2 left-0 w-full h-6 bg-gray-400 rounded-full transform -translate-y-1/2">
        {markers.map((marker, idx) => {
          const computedInches = getPositionInInches(marker);
          const positionPercent = (computedInches / TAPE_LENGTH_INCHES) * 100;
          const isAbove = idx % 2 !== 0;

          return (
            <div
              key={marker.name || idx}
              className="absolute flex flex-col items-center"
              style={{
                left: `${positionPercent}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div
                className={`text-[10px] text-center ${
                  isAbove ? "-mb-6" : "mt-2"
                }`}
              >
                {marker.label}
              </div>
              <div className="h-6 w-[2px] bg-black" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Tube;
