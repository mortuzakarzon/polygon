import React from "react";

const AreaList = ({ polygons, setPolygons }) => {
  return (
    <div id="areaList" className="arealist-container">
      {polygons.map((polygon, index) => (
        <div key={index}>
          <span>Area {index + 1}</span>
          <button
            onClick={() => {
              const newPolygons = polygons.filter((_, i) => i !== index);
              setPolygons(newPolygons);
            }}
          >
            Remove Area
          </button>
          <ul>
            {polygon.paths.map((coord, i) => (
              <li key={i}>
                Coordinate {i + 1}: {coord.lat}, {coord.lng}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AreaList;
