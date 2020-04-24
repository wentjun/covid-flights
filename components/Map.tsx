import React from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';

// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.355042,
  longitude: 103.817996,
  zoom: 10,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,

};

const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

export const Map: React.FC = () => {
  
  return (
    <DeckGL
      controller
      width='100%'
      height='100%'
      initialViewState={INITIAL_VIEW_STATE}
      layers={[
        new LineLayer({id: 'line-layer', data})
      ]}
    >
      <StaticMap 
        width='100%'
        height='100%'
        mapStyle='mapbox://styles/mapbox/dark-v9?optimize=true'
        mapboxApiAccessToken='pk.eyJ1Ijoid2VudGp1biIsImEiOiJjazcxNmVrNjQwM2xvM2xuMWltZXVnMzk5In0.1onX_NKZazXl21fjb_6TlA'
      />
    </DeckGL>
  );
  
}
