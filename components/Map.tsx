import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, ArcLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';
import { styled } from 'styletron-react';
import airports from '../utils/airports.json';
import flights from '../utils/20200101.json';
import { Airport } from '../interfaces/airports';
import { Flight } from '../interfaces/flight';

// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.355042,
  longitude: 103.817996,
  zoom: 10,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

interface TooltipContent {
  x: number;
  y: number;
  content: Airport | Flight;
  type: 'airport' | 'flight';
}
interface TooltipProps {
  $x: number;
  $y: number;
}


// custom typeguards for Airport and Flight types
const isAirport = (airport: Airport | Flight): airport is Airport => (airport as Airport).icao !== undefined;
const isFlight = (flight: Airport | Flight): flight is Flight => (flight as Flight).icao24 !== undefined;

const Map: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<TooltipContent>();
  const Tooltip = styled('div', ({ $x, $y }: TooltipProps) => ({
    left: `${$x}px`,
    top: `${$y}px`,
    zIndex: 1000,
    position: 'absolute',
    padding: '4px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    maxWidth: '300px',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
  }));

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
        setTooltipContent({
          x,
          y,
          content: object as Airport,
          type: 'airport',
        });
      },
    }),
    new ArcLayer({
      id: 'flight-arcs',
      data: flights as any[],
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      getTargetColor: () => [213, 184, 255, 120],
      getSourceColor: (d) => [255 * (1 - (d.end?.[0] * 2 / 10000)), 128 * (d.end?.[0] / 10000), 255 * (d.end?.[0] / 10000), 255 * (1 - (d.end?.[0] / 10000))],
      // @ts-ignore
      getStrokeWidth: () => 2,
      pickable: true,
      opacity: 0.8,
      getHeight: 0.1,
      getTilt: 50,
      onHover: ({ x, y, object }) => {
        setTooltipContent({
          x,
          y,
          content: object as Flight,
          type: 'flight',
        });
      },
    }),
  ];

  /**
   * renders tooltip when user hovers over airport layer/flight arc
   */
  const renderTooltip = () => {
    if (!tooltipContent) {
      return;
    }
    const {
      x, y, content, type,
    } = tooltipContent;

    return content && (
      <Tooltip
        $x={x}
        $y={y}
      >
        {type === 'airport' && isAirport(content) && (
          <>
            <span>{content.country}</span>
            <span>{content.name}</span>
          </>
        )}
        {type === 'flight' && isFlight(content) && (
          <>
            <span>{content.icao24}</span>
            <span>{content.estDepartureAirport}</span>
            <span>{content.estArrivalAirport}</span>
          </>
        )}
      </Tooltip>
    );
  };

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
