import { Label2, Paragraph3 } from 'baseui/typography';
import React from 'react';
import { styled } from 'styletron-react';
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
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  maxWidth: '500px',
  fontSize: '10px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '5px',
}));

export interface FlightContent {
  icao24: string;
  departureAirport: string;
  arrivalAirport: string;
  firstSeen: number;
  lastSeen: number;
}

export interface TooltipContent {
  x: number;
  y: number;
  content: Airport | FlightContent;
  type: 'airport' | 'flight';
}

// custom typeguards for Airport and Flight types
const isAirport = (airport: Airport | FlightContent): airport is Airport => (airport as Airport).icao !== undefined;
const isFlight = (flight: Airport | FlightContent): flight is FlightContent => (
  (flight as FlightContent).icao24 !== undefined
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
      <>
        <Label2>
          {content.departureAirport}
          {' '}
          to
          {' '}
          {content.arrivalAirport}
        </Label2>
        <Paragraph3>
          {content.icao24}
          <br />
          {new Date(content.firstSeen * 1000).toLocaleString('en-GB')}
          <br />
          {new Date(content.lastSeen * 1000).toLocaleString('en-GB')}
        </Paragraph3>
      </>
    )}
  </StyledTooltip>
);

// export default Tooltip;
