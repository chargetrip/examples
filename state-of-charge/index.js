import { drawRoute } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { fetchRoute } from './client';
import { getStateOfCharge } from './slider';
import { getDurationString } from '../utils';

/**
 * Draw a route on a map.
 *
 * The route object contains `polyline` data -  the polyline encoded route (series of coordinates as a single string).
 * We need to decode this information first. We use Mapbox polyline tool (https://www.npmjs.com/package/@mapbox/polyline) for this.
 * As a result of decoding we get pairs [latitude, longitude].
 * To draw a route on a map we use Mapbox GL JS. This tool uses the format [longitude,latitude],
 * so we have to reverse every pair.
 *
 * @param data {object} route specification.
 * @param id {string} route ID.
 */
fetchRoute(getStateOfCharge(), routeData => {
  drawRoutePolyline(routeData);
});

export const drawRoutePolyline = data => {
  const decodedData = mapboxPolyline.decode(data.polyline);
  const reversed = decodedData.map(item => item.reverse());

  drawRoute(reversed, data.legs);
  displayRouteData(data);
};

/**
 * Show journey specific information like duration, consumption, costs etc.
 *
 * @param data {object} route specification
 */
const displayRouteData = data => {
  // the total distance of the route, in meters converted to km
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the amount of stops in this route
  const routeStops = `${data.charges ?? 0} stops`;

  // the total energy used of the route, in kWh
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  const hasBorderCrossing = checkBorderCrossing(data);

  // A combined field containing several of the route meta data
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // Enable or disable our border-crossing UI
  document.getElementById('border-crossing').style.display = hasBorderCrossing ? 'flex' : 'none';
};

/**
 * Check whether our route crosses a border based on country names.
 * @param { object } data - route specification
 * @returns { boolean } - whether we are still in the same country our not.
 */
const checkBorderCrossing = data => {
  // Get the country from the origin and destination name.
  var origin = data.legs[0].origin.properties.name.split(', ');
  var destination = data.legs[data.legs.length - 1].destination.properties.name.split(', ');

  // Compare the origins country to the destination country. If they are unequal we have a border-crossing.
  return origin.pop() !== destination.pop();
};
