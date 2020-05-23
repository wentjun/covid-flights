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

// const res = data.map((flight) => {
//   const { start, end, startName, endName, icao24, callsign } = flight;
//   // if (!icao24) {
//   //   return;
//   // }
//   const airline = airlines.find((obj) => callsign && obj.icao && callsign.includes(obj.icao));
//   if (!airline) {
//     console.log(callsign);
//   }
//   // if (!start || !startName) {
//   //   console.log(callsign)
//   // }

//   // if (!end || !endName) {
//   //   console.log(callsign)
//   // }
// });


const firstday = 1577808000;
const oneDay = 86400;
// const res = [];

const timeSeries = [{"date":1577808000},{"date":1577894400},{"date":1577980800},{"date":1578067200},{"date":1578153600},{"date":1578240000},{"date":1578326400},{"date":1578412800},{"date":1578499200},{"date":1578585600},{"date":1578672000},{"date":1578758400},{"date":1578844800},{"date":1578931200},{"date":1579017600},{"date":1579104000},{"date":1579190400},{"date":1579276800},{"date":1579363200},{"date":1579449600},{"date":1579536000},{"date":1579622400},{"date":1579708800},{"date":1579795200},{"date":1579881600},{"date":1579968000},{"date":1580054400},{"date":1580140800},{"date":1580227200},{"date":1580313600},{"date":1580400000},{"date":1580486400},{"date":1580572800},{"date":1580659200},{"date":1580745600},{"date":1580832000},{"date":1580918400},{"date":1581004800},{"date":1581091200},{"date":1581177600},{"date":1581264000},{"date":1581350400},{"date":1581436800},{"date":1581523200},{"date":1581609600},{"date":1581696000},{"date":1581782400},{"date":1581868800},{"date":1581955200},{"date":1582041600},{"date":1582128000},{"date":1582214400},{"date":1582300800},{"date":1582387200},{"date":1582473600},{"date":1582560000},{"date":1582646400},{"date":1582732800},{"date":1582819200},{"date":1582905600},{"date":1582992000},{"date":1583078400},{"date":1583164800},{"date":1583251200},{"date":1583337600},{"date":1583424000},{"date":1583510400},{"date":1583596800},{"date":1583683200},{"date":1583769600},{"date":1583856000},{"date":1583942400},{"date":1584028800},{"date":1584115200},{"date":1584201600},{"date":1584288000},{"date":1584374400},{"date":1584460800},{"date":1584547200},{"date":1584633600},{"date":1584720000},{"date":1584806400},{"date":1584892800},{"date":1584979200},{"date":1585065600},{"date":1585152000},{"date":1585238400},{"date":1585324800},{"date":1585411200},{"date":1585497600},{"date":1585584000},{"date":1585670400},{"date":1585756800},{"date":1585843200},{"date":1585929600},{"date":1586016000},{"date":1586102400},{"date":1586188800},{"date":1586275200},{"date":1586361600},{"date":1586448000},{"date":1586534400},{"date":1586620800},{"date":1586707200},{"date":1586793600},{"date":1586880000},{"date":1586966400},{"date":1587052800},{"date":1587139200},{"date":1587225600},{"date":1587312000},{"date":1587398400},{"date":1587484800},{"date":1587571200},{"date":1587657600},{"date":1587744000},{"date":1587830400},{"date":1587916800},{"date":1588003200},{"date":1588089600},{"date":1588176000},{"date":1588262400},{"date":1588348800},{"date":1588435200},{"date":1588521600},{"date":1588608000},{"date":1588694400},{"date":1588780800},{"date":1588867200},{"date":1588953600}]

const res = timeSeries.map(({ date }, index) => {
  const start = firstday + (index  * 86400);
  const end = start + 86400;
  // console.log(start);
  // console.log(end);
  const total = data.filter(({ lastSeen, firstSeen, estArrivalAirport, estDepartureAirport }) => {
    if (estArrivalAirport && estArrivalAirport.trim() === 'WSSS') {
      return lastSeen >= start && lastSeen < end;
    } else if (estDepartureAirport && estDepartureAirport.trim() === 'WSSS') {
      return firstSeen >= start && firstSeen < end;
    }
  });
  const departure = total.filter(({ estArrivalAirport }) => estArrivalAirport && estArrivalAirport.trim() === 'WSSS');
  const arrival = total.filter(({ estDepartureAirport }) => estDepartureAirport && estDepartureAirport.trim() === 'WSSS');
  return {
    date,
    totalFlightsCount: total.length,
    departureCount: departure.length,
    arrivalCount: arrival.length,
  };
});

console.log(JSON.stringify(res));