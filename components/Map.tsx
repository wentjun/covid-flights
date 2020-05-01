import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import React, { useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { Airport } from '../interfaces/airports';
import { Flight } from '../interfaces/flight';
import airportsRaw from '../utils/airports.json';
import DateSlider from './DateSlider';
import { TooltipContent, ToolTip, FlightContent } from './Tooltip';

const airports = airportsRaw as Airport[];

// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.355042,
  longitude: 103.817996,
  zoom: 10,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

interface MapProps {
  flightData: Flight[];
}

const Map: React.FC<MapProps> = ({ flightData }) => {
  const timeRange: [number, number] = flightData.reduce(
    (range, d) => {
      const t = d.lastSeen;
      // eslint-disable-next-line no-param-reassign
      range = [Math.min(range[0], t), Math.max(range[1], t)];
      return range;
    },
    [Infinity, -Infinity],
  );
  const [filteredFlightData, setFilteredFlightData] = useState<Flight[]>(flightData);
  const [tooltipContent, setTooltipContent] = useState<TooltipContent>();

  const renderLayers = [
    new ScatterplotLayer<Airport>({
      id: 'airports',
      data: airports,
      radiusScale: 20,
      getPosition: (d) => d.coordinates as [number, number],
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
      data: filteredFlightData as any[],
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      getTargetColor: () => [213, 184, 255, 120],
      getSourceColor: (d) => [255 * (1 - (d.end?.[0] * 2 / 10000)), 128 * (d.end?.[0] / 10000), 255 * (d.end?.[0] / 10000), 255 * (1 - (d.end?.[0] / 10000))],
      getWidth: 2,
      pickable: true,
      opacity: 0.8,
      getHeight: 0.1,
      getTilt: 50,
      onHover: ({ x, y, object }) => {
        setTooltipContent({
          x,
          y,
          content: object as FlightContent,
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
      <ToolTip
        x={x}
        y={y}
        type={type}
        content={content}
      />

    );
  };

  const onDateFilter = (value: number) => {
    setFilteredFlightData(flightData.filter(({ lastSeen }) => lastSeen <= value && lastSeen > (value - 86400)));
  };

  return (
    <>
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
          // eslint-disable-next-line max-len
          mapboxApiAccessToken='pk.eyJ1Ijoid2VudGp1biIsImEiOiJjazcxNmVrNjQwM2xvM2xuMWltZXVnMzk5In0.1onX_NKZazXl21fjb_6TlA'
        />
        {renderTooltip()}

      </DeckGL>
      <DateSlider
        range={timeRange}
        onFilter={onDateFilter}
      />
    </>
  );
};

export default Map;
