import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import airports from '../utils/airports.json';
import flights from '../utils/20200101.json';
import { Airport } from '../interfaces/airports';


// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.355042,
  longitude: 103.817996,
  zoom: 10,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

interface AirportContent {
  x: number;
  y: number;
  content: Airport;
}

const Map: React.FC = () => {
  const [airportContent, setAirportContent] = useState<AirportContent>();

  const renderTooltip = () => {
    if (!airportContent) {
      return;
    }
    const { x, y, content } = airportContent;
    return content && (
      <div
        className='tooltip'
        style={{
          left: x,
          top: y,
          zIndex: 1000,
          position: 'absolute',
          padding: '4px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          maxWidth: '300px',
          fontSize: '10px',
        }}
      >
        <div>{content.country}</div>
        <div>{content.name}</div>
      </div>
    );
  };

  const renderLayers = [
    new ScatterplotLayer<Airport>({
      id: 'airports',
      // @ts-ignore
      data: airports,
      radiusScale: 20,
      getPosition: (d) => d.coordinates,
      getFillColor: [255, 140, 0],
      // getRadius: (d) => getSize(d.type),
      getRadius: 60,
      pickable: true,
      onHover: ({ x, y, object }) => {
        setAirportContent({
          x,
          y,
          content: object as Airport,
        });
      },
    }),
    new LineLayer({
      id: 'flight-paths',
      data: flights as any[],
      opacity: 0.8,
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      getColor: (d) => {
        // const z = d.start[2];
        const z = d.estArrivalAirportHorizDistance;
        const r = z / 10000;
        return [255 * (1 - r * 2), 128 * r, 255 * r, 255 * (1 - r)];
      },
      getWidth: 3,
      pickable: true,
      // onHover: this._onHover,
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
      {renderTooltip()}
    </DeckGL>
  );
};

export default Map;
