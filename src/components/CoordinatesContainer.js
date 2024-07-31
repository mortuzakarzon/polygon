import React from "react";

function CoordinatesContainer() {
  return (
    <div className="coordinates-container">
      <div className="header">
        <input
          type="text"
          id="locationName"
          placeholder="Enter location name"
        />
        <br />
        <button id="doneButton">Done</button>
        <button id="resetButton">Reset</button>
        <button id="saveButton">Save</button>
        <input type="file" id="geoJsonUpload" accept=".geojson,.json" />
        <button id="uploadButton">Upload GeoJSON</button>
      </div>
      <div id="coordinates" className="coordinates-list"></div>
    </div>
  );
}

export default CoordinatesContainer;
