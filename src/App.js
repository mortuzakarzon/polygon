// src/App.jsx

import React, { useState } from "react";
import MapComponent from "./components/MapComponent";
import CoordinatesContainer from "./components/CoordinatesContainer";
import AreaList from "./components/AreaList";
import "./App.css";

const App = () => {
  const [polygons, setPolygons] = useState([]);

  const handlePolygonComplete = (polygon) => {
    const paths = polygon
      .getPath()
      .getArray()
      .map((coord) => ({
        lat: coord.lat(),
        lng: coord.lng(),
      }));

    const newPolygon = {
      paths,
      options: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      },
    };

    setPolygons([...polygons, newPolygon]);
    // Optionally clear the polygon after saving
    polygon.setMap(null);
  };

  return (
    <>
      <MapComponent onPolygonComplete={handlePolygonComplete} />
      <AreaList />
      <CoordinatesContainer />
      {/* <div>
        <h2>Polygons</h2>
        {polygons.map((polygon, index) => (
          <div key={index}>
            <h3>Polygon {index + 1}</h3>
            {polygon.paths.map((coord, idx) => (
              <div key={idx}>
                Coordinate {idx + 1}: {coord.lat}, {coord.lng}
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </>
  );
};

export default App;
