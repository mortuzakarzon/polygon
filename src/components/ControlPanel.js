import React from "react";

const ControlPanel = ({
  doneButtonVisible,
  doneBtn,
  resetBtn,
  saveBtn,
  handleFileUpload,
}) => {
  return (
    <div className="header">
      <input type="text" id="locationName" placeholder="Enter location name" />
      <br />
      <button
        onClick={doneBtn}
        style={{ display: doneButtonVisible ? "inline" : "none" }}
      >
        Done
      </button>
      <button onClick={resetBtn}>Reset</button>
      <button onClick={saveBtn}>Save</button>
      <input
        type="file"
        id="geoJsonUpload"
        accept=".geojson,.json"
        onChange={handleFileUpload}
      />
      <button id="uploadButton">Upload GeoJSON</button>
    </div>
  );
};

export default ControlPanel;
