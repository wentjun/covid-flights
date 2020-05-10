import { styled } from 'baseui';
import { Label2, Paragraph3 } from 'baseui/typography';
import React, { Fragment } from 'react';
import { Airport } from '../interfaces/airports';

interface TooltipProps {
  $x: number;
  $y: number;
}

const StyledTooltip = styled('div', ({ $x, $y }: TooltipProps) => ({
  left: `${$x}px`,
  top: `${$y}px`,
  zIndex: 1000,
  position: 'absolute',
  padding: '4px',
  background: 'rgba(31, 31, 31, 0.8)',
  color: '#fff',
  maxWidth: '300px',
  fontSize: '10px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '5px',
}));

export interface FlightContent {
  callsign: string;
  departureAirport: string;
  arrivalAirport: string;
  firstSeen: number;
  lastSeen: number;
}

export interface TooltipContent {
  x: number;
  y: number;
  content: Airport | FlightContent[];
  type: 'airport' | 'flight';
}

// custom typeguards for Airport and Flight types
export const isAirport = (airport: Airport | FlightContent[]): airport is Airport => (
  (airport as Airport).icao !== undefined
);
export const isFlight = (flights: Airport | FlightContent[]): flights is FlightContent[] => (
  Array.isArray(flights) && (flights).some(({ callsign }) => callsign !== undefined)
);

export const ToolTip: React.FC<TooltipContent> = ({
  x, y, content, type,
}) => (
  <StyledTooltip
    $x={x}
    $y={y}
  >
    {type === 'airport' && isAirport(content) && (
      <>
        <Label2>{content.country}</Label2>
        <Label2>{content.name}</Label2>
      </>
    )}
    {type === 'flight' && isFlight(content) && (
      content.map(({
        departureAirport, arrivalAirport, callsign, firstSeen, lastSeen,
      }) => (
        <Fragment key={callsign}>
          <Label2>
            {callsign}
            :
            {' '}
            {departureAirport}
            {' '}
            to
            {' '}
            {arrivalAirport}
          </Label2>
          <Paragraph3>
            {new Date(firstSeen * 1000).toLocaleString('en-GB', { hour12: true })}
            <br />
            {new Date(lastSeen * 1000).toLocaleString('en-GB', { hour12: true })}
          </Paragraph3>
        </Fragment>
      ))
    )}
  </StyledTooltip>
);

// export default Tooltip;
