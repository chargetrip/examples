import { getRoutePath } from './queries.js';

/**
 * Show route path specific information like elevation, consumption, speed etc.
 * The temperature and maxspeed are not yet part of the API. This will be added soon.
 * @param path {object} route path specification.
 */
export const displaySpecs = path => {
  // The consumption, in kWh, of this route path segment.
  document.getElementById('consumption').innerHTML = path.routePath.consumptionPerKm * 1000 + ' Wh/km';
  // The elevation (altitude) in meters for this route path segment.
  document.getElementById('height').innerHTML = path.routePath.elevation + ' m';
  // The average speed, in km/h, for this route path segment.
  document.getElementById('average-speed').innerHTML = path.routePath.avSpeed + ' km';
};

/**
 * Find the closest point in the polyline.
 * @param polyline {array} polyline coordinates.
 * @param location {array} the location that was clicked on the polyline.
 */
export const findClosest = (polyline, location) => {
  const [x1, y1] = location;
  let closest = Math.sqrt(Math.pow(Math.abs(x1 - polyline[0][0]), 2) + Math.pow(Math.abs(y1 - polyline[0][1]), 2));
  let closestIndex = 0;
  for (let i = 1; i < polyline.length - 1; i++) {
    let distance = Math.sqrt(Math.pow(Math.abs(x1 - polyline[i][0]), 2) + Math.pow(Math.abs(y1 - polyline[i][1]), 2));
    if (distance <= closest) {
      closest = distance;
      closestIndex = i;
    }
  }
  return closestIndex;
};

const markElevationPlot = (closestIndex, coordinates) => {
  const elevatetionGraph = document.getElementById('chart');
  const total = coordinates.length;
  const percentage = closestIndex / total;
  console.log(elevatetionGraph.offsetWidth);
  document.getElementById('line').style.marginLeft = percentage * (elevatetionGraph.offsetWidth - 20) + 'px';
};

/**
 * Update route path specific information by clicking on the polyline.
 * @param client {object}
 * @param map {object} the map generated by mapbox.
 * @param coordinates {array} polyline coordinates.
 * @param id {string} the ID of the route.
 */
export const updateSpecs = (client, map, coordinates, id) => {
  let location = coordinates[0];
  map.on('click', 'polyline', e => {
    location = [e.lngLat.lng, e.lngLat.lat];
    let closest = 0;
    closest = findClosest(coordinates, location);
    markElevationPlot(closest, coordinates);
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    client
      .query(getRoutePath(id, coordinates[closest]))
      .toPromise()
      .then(response => {
        displaySpecs(response.data);
      })
      .catch(error => console.log(error));
  });
  map.on('mouseenter', 'polyline', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'polyline', () => {
    map.getCanvas().style.cursor = '';
  });
};
