import { getDurationString } from '../../../utils';

export const attachEventListeners = data => {
  const driveButton = document.getElementById('drive');
  driveButton.removeAttribute('disabled');
  driveButton.addEventListener('click', () => {
    window.open(getGoogleMapDirectionsURL(data.legs));
  });
};

/**
 * Show journey specific information like duration, consumption, costs etc.
 *
 * @param data {object} route specification
 */
export const renderRouteData = data => {
  // the total distance of the route, in meters converted to km
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the amount of stops in this route
  const routeStops = `${data.charges ?? 0} stops`;

  // the total energy used of the route, in kWh
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  // the average temperature based on all stops across the route
  const averageTemperature = calculateAverageTemperature(data);

  // A combined field containing several of the route meta data
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.durations?.total ?? 0)}`;

  // the total time required to charge of the entire route, in seconds
  document.getElementById('charge-duration').innerHTML = getDurationString(data.durations?.charging ?? 0);

  // the total energy used of the route, in kWh
  document.getElementById('consumption').innerHTML = routeEnergy;

  // the money saved by the user driving this route with the electric vehicle
  document.getElementById('cost').innerHTML = `'€'${data.savings?.money ?? 0} `;

  // Enable or disable our border-crossing UI
  document.getElementById('border-crossing').style.display = data.tags.includes('crossborder') ? 'flex' : 'none';

  // A rendering of the average temperature on a specific route
  const averageTemperatureTag = document.getElementById('average-temperature');
  averageTemperatureTag.innerHTML = `${averageTemperature} ºC`;

  // Set the temperature tag color based on the temperature
  if (averageTemperature < 0) {
    averageTemperatureTag.classList.add('blue');
  } else if (averageTemperature > 23) {
    averageTemperatureTag.classList.add('red');
  } else {
    averageTemperatureTag.classList.add('gray');
  }
};

/**
 * Calculate the average temperature by adding up all temperatures across every stop
 * and dividing them by the number of stations.
 * @param { object } data - route specification
 * @returns { int } - average temperature rounded across all stops to 1 decimal
 */
const calculateAverageTemperature = data => {
  let averageTemperature = 0;

  // Go over every leg in our route and get the temperature on every stop origin.
  // To prevent an overlap on the last leg we select the destination.
  // We then add up all the temperatures into one variable.
  data.legs.map((legs, idx) => {
    averageTemperature +=
      idx === data.legs.length - 1
        ? Number(legs.destination.properties.location?.temperature)
        : Number(legs.origin.properties.location?.temperature);
  });

  // Average out the temperature by dividing it through all stops and round the value to 1 decimal
  return (averageTemperature / data.legs.length).toFixed(1);
};

/**
 * Create a Google Map Directions URL.
 * See documentation here https://developers.google.com/maps/documentation/urls/get-started#directions-action.
 *
 * @param legs Route legs (origin, destination, waypoints and stations)
 * @returns {string} Google Map Directions URL
 */
const getGoogleMapDirectionsURL = legs => {
  if (legs.length === 0) return;

  let googleDirURL = `https://www.google.com/maps/dir/?api=1`;
  const origin = legs[0].origin?.geometry?.coordinates;
  const destination = legs[legs.length - 1].destination?.geometry?.coordinates;

  // Coordinates are an array with longitude as first value and latitude as the second one
  // we have to reverse it as Google Maps accept latitude first
  const googleOrigin = origin
    ?.slice()
    .reverse()
    ?.join(',');
  const googleDestination = destination
    ?.slice()
    .reverse()
    ?.join(',');
  googleDirURL += `&origin=${googleOrigin}&destination=${googleDestination}`;

  if (legs.length > 2) {
    googleDirURL += `&waypoints=`;

    legs.forEach((leg, index) => {
      // Add charging stations and waypoints
      if (index !== legs.length - 1) {
        googleDirURL += `${leg.destination?.geometry?.coordinates
          ?.slice()
          .reverse()
          ?.join(',')}|`;
      }
    });
  }

  googleDirURL += `&dir_action=navigate&travelmode=driving`;

  return encodeURI(googleDirURL);
};
