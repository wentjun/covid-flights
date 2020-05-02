const airports = require('./airports.json');
const data = require('./20200101.json');

const res = data.map((flight) => {
  const { estDepartureAirport, estArrivalAirport, icao24,  firstSeen, lastSeen, callsign  } = flight;
  const start = airports.find(({ icao }) => estDepartureAirport && (icao.trim() === estDepartureAirport.trim()))
  const end = airports.find(({ icao }) => estArrivalAirport && (icao.trim() === estArrivalAirport.trim()));
  // console.log(start);
  // console.log(end);
  if (!end || !start) {
    return {
      icao24,
      firstSeen,
      lastSeen,
      callsign,
      estDepartureAirport,
      estArrivalAirport,
      // start: start.coordinates,
      // end: end.coordinates,
      // startName: start.name,
      // endName: end.name,
    }
  }

  return {
    icao24,
    firstSeen,
    lastSeen,
    callsign,
    estDepartureAirport,
    estArrivalAirport,
    start: start.coordinates,
    end: end.coordinates,
    startName: start.name,
    endName: end.name,
  }
});

console.log(JSON.stringify(res));