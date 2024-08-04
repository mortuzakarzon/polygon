import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import "./App.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 48.09041,
  lng: 11.65044,
};

const polyOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  editable: true,
  draggable: true,
  geodesic: true,
};

function App() {
  const [map, setMap] = useState(null);
  const [polyCoords, setPolyCoords] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [doneButtonVisible, setDoneButtonVisible] = useState(false);
  const polygonRefs = useRef([]);

  const onMapClick = (event) => {
    const newCoords = [
      ...polyCoords,
      { lat: event.latLng.lat(), lng: event.latLng.lng() },
    ];
    setPolyCoords(newCoords);

    if (newCoords.length >= 3) {
      setDoneButtonVisible(true);
    }
  };

  const doneBtn = () => {
    if (polyCoords.length >= 3) {
      const newPolygon = {
        paths: polyCoords,
        options: polyOptions,
      };
      setPolygons([...polygons, newPolygon]);
      setPolyCoords([]);
      setDoneButtonVisible(false);
    }
  };

  const resetBtn = () => {
    setPolyCoords([]);
    setPolygons([]);
    setDoneButtonVisible(false);
  };

  const saveBtn = () => {
    const locationName = document.getElementById("locationName").value.trim();
    if (!locationName) {
      alert("Location name is required to save the file.");
      return;
    }

    const geoJsonData = {
      type: "FeatureCollection",
      locationName: locationName,
      features: polygons.map((polygon, index) => ({
        type: "Feature",
        properties: {
          areaName: "Area " + (index + 1),
        },
        geometry: {
          type: "Polygon",
          coordinates: [polygon.paths.map((coord) => [coord.lng, coord.lat])],
        },
      })),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(geoJsonData));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", locationName + ".geojson");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const onEdit = (index, isNewPolygon = false) => {
    const path = isNewPolygon
      ? polygonRefs.current[polygonRefs.current.length - 1].getPath()
      : polygonRefs.current[index].getPath();

    const newCoords = path.getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));

    if (isNewPolygon) {
      setPolyCoords(newCoords);
    } else {
      const updatedPolygons = polygons.map((polygon, i) => {
        if (i === index) {
          return { ...polygon, paths: newCoords };
        }
        return polygon;
      });
      setPolygons(updatedPolygons);
    }
  };

  const handlePolygonLoad = (polygon, index, isNewPolygon = false) => {
    if (isNewPolygon) {
      polygonRefs.current[polygonRefs.current.length - 1] = polygon;
    } else {
      polygonRefs.current[index] = polygon;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const geoJson = JSON.parse(e.target.result);
        const newPolygons = geoJson.features.map((feature) => ({
          paths: feature.geometry.coordinates[0].map((coord) => ({
            lat: coord[1],
            lng: coord[0],
          })),
          options: polyOptions,
        }));
        setPolygons(newPolygons);
        if (newPolygons.length > 0) {
          const firstFeature = geoJson.features[0];
          const centerLatLng = {
            lat: firstFeature.geometry.coordinates[0][0][1],
            lng: firstFeature.geometry.coordinates[0][0][0],
          };
          setMap((map) => map && map.setCenter(centerLatLng)); // Set map center to the first polygon's center
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please select a GeoJSON file.");
    }
  };

  return (
    <div id="container">
      <div id="map">
        <LoadScript
          googleMapsApiKey={process.env.AIzaSyCEUrQ3YfiDOnpK5WIDJOCfW6KnJraMM_w}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onLoad={(map) => setMap(map)}
            onClick={onMapClick}
          >
            {polygons.map((polygon, index) => (
              <Polygon
                key={index}
                paths={polygon.paths}
                options={polygon.options}
                editable
                draggable
                onMouseUp={() => onEdit(index)}
                onDragEnd={() => onEdit(index)}
                onLoad={(polygon) => handlePolygonLoad(polygon, index)}
              />
            ))}
            {polyCoords.length > 0 && (
              <Polygon
                paths={polyCoords}
                options={polyOptions}
                editable
                draggable
                onMouseUp={() => onEdit(polygons.length, true)}
                onDragEnd={() => onEdit(polygons.length, true)}
                onLoad={(polygon) =>
                  handlePolygonLoad(polygon, polygons.length, true)
                }
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="coordinates-container">
        <div className="header">
          <input
            type="text"
            id="locationName"
            placeholder="Enter location name"
          />
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

        <div id="coordinates" className="coordinates-list">
          {polyCoords.map((coord, index) => (
            <div key={index}>
              Coordinate {index + 1}: {coord.lat}, {coord.lng}
              <button
                onClick={() => {
                  const newCoords = polyCoords.filter((_, i) => i !== index);
                  setPolyCoords(newCoords);
                  if (newCoords.length < 3) {
                    setDoneButtonVisible(false);
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}

export default App;
