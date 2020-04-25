const airports = require('./airports.json');
const data = require('./20200101.json');

const res = data.map((flight) => {
  const { estDepartureAirport, estArrivalAirport } = flight;
  const start = airports.find(({ icao }) => estDepartureAirport && (icao.trim() === estDepartureAirport.trim()))
  const end = airports.find(({ icao }) => estArrivalAirport && (icao.trim() === estArrivalAirport.trim()));
  // console.log(start);
  // console.log(end);
  if (!end || !start) {
    return flight;
  }

  return {
    ...flight,
    start: start.coordinates,
    end: end.coordinates,
  }
});

console.log(JSON.stringify(res));