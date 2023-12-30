import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import './OLMap.css';

const OLMap = props => {
  const mapRef = useRef();
  const map = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    // Create a point for the marker
    const point = new Point(center);

    // Create a feature with the point
    const marker = new Feature(point);

    // Apply a style to the marker (add your own marker icon here)
    marker.setStyle(new Style({
      image: new Icon({
        // Example: 'https://example.com/path/to/marker-icon.png'
        // Ensure the URL or path is correct and accessible
        src: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png',
        scale: 0.05 // Adjust the scale as needed
      })
    }));

    // Create a vector source and add the marker feature to it
    const vectorSource = new VectorSource({
      features: [marker]
    });

    // Create a vector layer with the vector source
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Initialize the map with the tile and vector layers
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: center,
        zoom: zoom
      })
    });
  }, [center, zoom]);

  return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>;
};

export default OLMap;
