import React, { useState, useRef } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer";
import CoordinatesList from "./components/CoordinatesList";
import ControlPanel from "./components/ControlPanel";
import AreaList from "./components/AreaList";
import "./App.css";

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

      // Center map on the newly drawn polygon
      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        polyCoords.forEach((coord) =>
          bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng))
        );
        map.fitBounds(bounds);
      }
    }
  };

  const resetBtn = () => {
    setPolyCoords([]);
    setPolygons([]);
    setDoneButtonVisible(false);

    // Reset the map center if needed
    if (map) {
      map.setCenter(center);
      map.setZoom(16);
    }
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
          if (map) {
            map.setCenter(centerLatLng);
            map.setZoom(16);
          }
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
        <MapContainer
          center={center}
          map={map}
          setMap={setMap}
          polygons={polygons}
          polyCoords={polyCoords}
          onMapClick={onMapClick}
          onEdit={onEdit}
          handlePolygonLoad={handlePolygonLoad}
        />
      </div>
      <div className="coordinates-container">
        <ControlPanel
          doneButtonVisible={doneButtonVisible}
          doneBtn={doneBtn}
          resetBtn={resetBtn}
          saveBtn={saveBtn}
          handleFileUpload={handleFileUpload}
        />
        <CoordinatesList
          polyCoords={polyCoords}
          setPolyCoords={setPolyCoords}
        />
      </div>
      <AreaList polygons={polygons} setPolygons={setPolygons} />
    </div>
  );
}

export default App;
