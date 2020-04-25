import React from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import airports from '../utils/airports.json';
// import { Airport } from '../interfaces/airports';

// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.355042,
  longitude: 103.817996,
  zoom: 10,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,

};

const Map: React.FC = () => {
  const renderLayers = [
    new ScatterplotLayer<any>({
      id: 'airports',
      data: airports as any[],
      radiusScale: 20,
      getPosition: (d) => d.coordinates,
      getFillColor: [255, 140, 0],
      // getRadius: (d) => getSize(d.type),
      getRadius: 60,
      pickable: true,
      // onHover: this._onHover
    }),
  ];
  return (
    <DeckGL
      controller
      width='100%'
      height='100%'
      initialViewState={INITIAL_VIEW_STATE}
      layers={renderLayers}
    >
      <StaticMap
        width='100%'
        height='100%'
        mapStyle='mapbox://styles/mapbox/dark-v9?optimize=true'
        mapboxApiAccessToken='pk.eyJ1Ijoid2VudGp1biIsImEiOiJjazcxNmVrNjQwM2xvM2xuMWltZXVnMzk5In0.1onX_NKZazXl21fjb_6TlA'
      />
    </DeckGL>
  );
};

export default Map;
