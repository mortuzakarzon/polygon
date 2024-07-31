import React, { useState, useCallback } from "react";

import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
} from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "../constants";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 48.09041,
  lng: 11.65044,
};

const MapComponent = ({ onPolygonComplete }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
    libraries: GOOGLE_MAPS_LIBRARIES, // Use the constant here
  });

  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  const [map, setMap] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    // You can now use the map instance for further actions
    // Example: mapInstance.setCenter(center);
  }, []);

  const onPolygonCompleteHandler = (polygon) => {
    onPolygonComplete(polygon);
  };

  return isLoaded ? (
    <div id="map">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
      >
        <DrawingManager
          options={{
            drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: ["polygon"],
            },
            polygonOptions: {
              editable: true,
              draggable: true,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
            },
          }}
          onPolygonComplete={onPolygonCompleteHandler}
        />
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default MapComponent;
