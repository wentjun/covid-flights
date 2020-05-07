const airports = require('./airports.json');
const data = require('./flights.json');
const airlines = require('./airlines.json');

// const data1 = require('./d_20200401.json');
// const data2 = require('./d_20200407.json');
// const data3 = require('./d_20200413.json');
// const data4 = require('./d_20200419.json');
// const data5 = require('./d_20200425.json');

// const res = [...data, ...data1, ...data2, ...data3, ...data4, ...data5].map((flight) => {
//   const { estDepartureAirport, estArrivalAirport, icao24,  firstSeen, lastSeen, callsign  } = flight;
//   const start = airports.find(({ icao }) => estDepartureAirport && (icao.trim() === estDepartureAirport.trim()))
//   const end = airports.find(({ icao }) => estArrivalAirport && (icao.trim() === estArrivalAirport.trim()));
//   // console.log(start);
//   // console.log(end);
//   if (!end || !start) {
//     return {
//       icao24,
//       firstSeen,
//       lastSeen,
//       callsign,
//       estDepartureAirport,
//       estArrivalAirport,
//       // start: start.coordinates,
//       // end: end.coordinates,
//       // startName: start.name,
//       // endName: end.name,
//     }
//   }

//   return {
//     icao24,
//     firstSeen,
//     lastSeen,
//     callsign,
//     estDepartureAirport,
//     estArrivalAirport,
//     start: start.coordinates,
//     end: end.coordinates,
//     startName: start.name,
//     endName: end.name,
//   }
// });

const res = data.map((flight) => {
  const { start, end, startName, endName, icao24, callsign } = flight;
  // if (!icao24) {
  //   return;
  // }
  const airline = airlines.find((obj) => callsign && obj.icao && callsign.includes(obj.icao));
  if (!airline) {
    console.log(callsign);
  }
  // if (!start || !startName) {
  //   console.log(callsign)
  // }

  // if (!end || !endName) {
  //   console.log(callsign)
  // }
});

res;