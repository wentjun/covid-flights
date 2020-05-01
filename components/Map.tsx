import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { styled } from 'baseui';
import React, { useState } from 'react';
import { StaticMap } from 'react-map-gl';
import { Airport } from '../interfaces/airports';
import { Flight } from '../interfaces/flight';
import airlines from '../utils/airlines.json';
import airportsRaw from '../utils/airports.json';
import DateSlider from './DateSlider';
import InformationPanel from './InformationPanel';
import { FlightContent, ToolTip, TooltipContent } from './Tooltip';

const airports = airportsRaw as Airport[];

const ControlContainer = styled('div', ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',

  '@media (min-width: 768px)': {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
}));

// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.355042,
  longitude: 103.817996,
  zoom: 10,
  maxZoom: 16,
  pitch: 50,
  bearing: 0,
};

export interface PanelFilterCount {
  name: string;
  icao: string;
  count: number;
  checked: boolean;
}

export interface FilterContext {
  selectedDate: number;
  removedAirlines: string[];
}

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
  const [panelFilter, setPanelFilter] = useState<PanelFilterCount[]>();

  const [tooltipContent, setTooltipContent] = useState<TooltipContent>();
  const [filterContext, setFilterContext] = useState<FilterContext>({
    selectedDate: timeRange[1],
    removedAirlines: [],
  });

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

  /**
   * reset date filter, filters the flights that lies within the selected date's day range,
   * and reset airlines panel filters
   * @param current current date, in epoch
   */
  const onDateFilter = (current: number) => {
    setFilterContext({
      selectedDate: current,
      removedAirlines: [],
    });
    const dateFilteredFlights = flightData.filter(({ lastSeen }) => (
      lastSeen <= current
      && lastSeen > (current - 86400)
    ));
    setFilteredFlightData(dateFilteredFlights);

    const calculated: PanelFilterCount[] = dateFilteredFlights.reduce((acc, cur) => {
      const { callsign } = cur;
      const airline = airlines.find((obj) => obj.icao && callsign.includes(obj.icao));
      if (!airline || !airline.name || !airline.icao) {
        console.log(airline);
        console.log(callsign);
        return acc;
      }
      const { name, icao } = airline;
      if (!acc.some((option) => option.icao === icao)) {
        return [
          ...acc,
          {
            name,
            icao,
            count: 1,
            checked: true,
          },
        ];
      }
      return acc.map((option) => {
        if (option.icao === icao) {
          return {
            ...option,
            count: option.count + 1,
          };
        }

        return option;
      });
    }, [] as PanelFilterCount[]);
    setPanelFilter(calculated);
  };

  /**
   * add or remove airline codes on the filter, filters the flights that part of the selected airline codes
   * @param code airline code
   */
  const onAirlineFilter = (code: string) => {
    const { removedAirlines, selectedDate } = filterContext;
    const updatedRemovedAirlines = removedAirlines.includes(code)
      ? removedAirlines.filter((airline) => airline !== code)
      : [...removedAirlines, code];
    setFilterContext({
      ...filterContext,
      removedAirlines: updatedRemovedAirlines,
    });
    setFilteredFlightData(flightData.filter(({ callsign, lastSeen }) => (
      lastSeen <= selectedDate
      && lastSeen > (selectedDate - 86400)
      && !updatedRemovedAirlines.some((airlineCode) => callsign.includes(airlineCode))
    )));
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
      <ControlContainer>
        <InformationPanel
          filterContext={filterContext}
          panelFilter={panelFilter}
          data={filteredFlightData}
          onAirlineFilter={onAirlineFilter}
        />
        <DateSlider
          range={timeRange}
          onFilter={onDateFilter}
        />
      </ControlContainer>
    </>
  );
};

export default Map;
