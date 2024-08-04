import React from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
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

const MapContainer = ({
  center,
  map,
  setMap,
  polygons,
  polyCoords,
  onMapClick,
  onEdit,
  handlePolygonLoad,
}) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
  );
};

export default MapContainer;
