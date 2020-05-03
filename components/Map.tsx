import { MapView } from '@deck.gl/core';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { styled } from 'baseui';
import React, { useState, useRef } from 'react';
import { StaticMap } from 'react-map-gl';
import { PickInfo } from '@deck.gl/core/lib/deck';
import { Airport } from '../interfaces/airports';
import { Flight } from '../interfaces/flight';
import { FilterContext, PanelFilterCount } from '../interfaces/main';
import airlines from '../utils/airlines.json';
import airportsRaw from '../utils/airports.json';
import DateSlider from './DateSlider';
import InformationPanel from './InformationPanel';
import { FlightContent, ToolTip, TooltipContent } from './Tooltip';

const airports = airportsRaw as Airport[];

const MapContainer = styled('div', ({
  height: 'fill-available',
  maxHeight: '100vh',
}));

const ControlContainer = styled('div', ({ $theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  height: 'fill-available',
  maxHeight: '100vh',
  justifyContent: 'space-between',
  padding: $theme.sizing.scale600,
  zIndex: 1,

  '@media (min-width: 768px)': {
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 0,
  },
}));

// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 1.3501900434,
  longitude: 103.9940032959,
  zoom: 10,
  maxZoom: 16,
  pitch: 60,
  bearing: -30.791885970771773,
};

const VIEWS = [
  new MapView({
    id: 'map',
    width: '100%',
    height: '100%',
    controller: true,
  }),
];

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
  const deckRef = useRef<DeckGL>(null);

  /**
   * assigns flight arc objects to tooltip
   * @param param0 Info object for Flight arc
   */
  const onArcHover = ({ x, y, object }: PickInfo<Flight>) => {
    if (!object) {
      setTooltipContent(undefined);
      return;
    }
    const layers: PickInfo<Flight>[] = deckRef?.current?.pickObjects({
      x,
      y,
    });
    const content = layers.map(({
      object: {
        callsign, firstSeen, lastSeen, startName, endName,
      },
    }) => ({
      callsign,
      firstSeen,
      lastSeen,
      arrivalAirport: endName,
      departureAirport: startName,
    }));
    setTooltipContent({
      x,
      y,
      content,
      type: 'flight',
    });
  };

  const renderLayers = [
    new ScatterplotLayer<Airport>({
      id: 'airports',
      data: airports,
      radiusScale: 20,
      getPosition: (d) => d.coordinates as [number, number],
      getFillColor: [255, 140, 0],
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
      data: filteredFlightData,
      getSourcePosition: (d) => d.start,
      getTargetPosition: (d) => d.end,
      getTargetColor: (e) => (
        (tooltipContent?.content as FlightContent[])?.some(({ callsign }: FlightContent) => callsign === e.callsign)
          ? [0, 181, 204]
          : [231, 76, 60, 120]),
      getSourceColor: (e) => (
        (tooltipContent?.content as FlightContent[])?.some(({ callsign }: FlightContent) => callsign === e.callsign)
          ? [0, 181, 204, 120]
          : [255, 128, 255, 120]
      ),
      getWidth: (e) => (
        (tooltipContent?.content as FlightContent[])?.some(({ callsign }: FlightContent) => callsign === e.callsign)
          ? 3
          : 2
      ),
      pickable: true,
      opacity: 0.8,
      getHeight: 0.1,
      getTilt: 50,
      onHover: onArcHover,
      updateTriggers: {
        getTargetColor: [
          ((tooltipContent?.content as FlightContent[]) ?? []).find(({ callsign }: FlightContent) => callsign)?.callsign
          || null,
        ],
        getSourceColor: [
          ((tooltipContent?.content as FlightContent[]) ?? []).find(({ callsign }: FlightContent) => callsign)?.callsign
          || null,
        ],
        getWidth: [
          (tooltipContent?.content as FlightContent[])?.find(({ callsign }: FlightContent) => callsign)?.callsign
         || null,
        ],
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
        // console.log(airline);
        // console.log(callsign);
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
    <MapContainer>
      <DeckGL
        // @ts-ignore
        views={VIEWS}
        initialViewState={INITIAL_VIEW_STATE}
        layers={renderLayers}
        pickingRadius={3}
        ref={deckRef}
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
    </MapContainer>
  );
};

export default Map;
