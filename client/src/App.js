import React, {useRef, useEffect, useState, useCallback} from 'react';
import http from "./http-common";
import ReactMapGL, {Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import './App.css';
import Pin from './pin.js';
import axios from "axios";

const REACT_APP_MAPBOX_ACCESS_TOKEN = '';

function App() {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    height: 600,
    width: 600
  });

  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100
  });

  const [marker2, setMarker2] = useState({
    latitude: 40,
    longitude: -103
  });

  const [events, logEvents] = useState({});

  const onMarkerDragStart = useCallback(event => {
    logEvents(_events => ({..._events, onDragStart: event.lngLat}));
  }, []);

  const onMarkerDrag = useCallback(event => {
    logEvents(_events => ({..._events, onDrag: event.lngLat}));
  }, []);

  const onMarkerDragEnd = useCallback(event => {
    logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
    console.log(event)
  }, []);

  const onMarker2DragEnd = useCallback(event => {
    logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
    setMarker2({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
    console.log(event)
  }, []);

  const geojson = {type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [marker.longitude, marker.latitude], [marker2.longitude, marker2.latitude]
      ]
    }
  };

  const [positions, setPositions] = useState([]);

  const handleAddPosition = (value) => {
    http.post('/positions/add', {marker,marker2}).then(
        (res) => {
          http.get("/positions").then(r => setPositions(r.data.positions))
          console.log(res)
        }
    )

  };

  return (
      <div>
        <ReactMapGL
            {...viewport}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            mapboxApiAccessToken={REACT_APP_MAPBOX_ACCESS_TOKEN}
        >
          <Source id="mydata" type="geojson" data={geojson}>
            <Layer
                type='line'
                id='line'
                paint={{'line-color': '#BF93E4',
                  'line-width': 5}}
            />
            <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable
                onDragStart={onMarkerDragStart}
                onDrag={onMarkerDrag}
                onDragEnd={onMarkerDragEnd}
            >
              <Pin size={20} />
            </Marker>
            <Marker
                longitude={marker2.longitude}
                latitude={marker2.latitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable
                onDragStart={onMarkerDragStart}
                onDrag={onMarkerDrag}
                onDragEnd={onMarker2DragEnd}
            >
              <Pin size={20} />
            </Marker>
          </Source>


        </ReactMapGL>
        <div>
          <button onClick={handleAddPosition}>Save position</button>
          {positions.map(pos => {
            return (
                <div>{pos}</div>
            )
          })}
        </div>
      </div>
  );
}

export default App;
