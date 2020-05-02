export interface Flight {
  icao24: string;
  firstSeen: number;
  estDepartureAirport: string;
  lastSeen: number;
  estArrivalAirport: string;
  callsign: string;
  start: [number, number];
  end: [number, number];
  startName: string;
  endName: string;
}
