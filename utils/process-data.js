const airports = require('./airports.json');
const data = require('./flights.json');

const data1 = require('./20200401.json');
const data2 = require('./20200407.json');
const data3 = require('./20200413.json');
const data4 = require('./20200419.json');
const data5 = require('./20200425.json');

const res = [...data, ...data1, ...data2, ...data3, ...data4, ...data5].map((flight) => {
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