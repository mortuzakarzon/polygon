import React from "react";

const CoordinatesList = ({ polyCoords, setPolyCoords }) => {
  return (
    <div id="coordinates" className="coordinates-list">
      {polyCoords.map((coord, index) => (
        <div key={index}>
          Coordinate {index + 1}: {coord.lat}, {coord.lng}
          <button
            onClick={() => {
              const newCoords = polyCoords.filter((_, i) => i !== index);
              setPolyCoords(newCoords);
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default CoordinatesList;
