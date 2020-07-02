import mapboxgl from 'mapbox-gl';
import { drawClickedLine, drawPolyline, showLegs, addLineEnd } from './map-layers';
import { findClosest } from './journey-specs';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 6,
  center: [7.7, 52],
});

/**
 * Draw route polyline and show the point of origin and destinatio on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const drawRoute = (coordinates, legs) => {
  if (map.loaded()) {
    drawPolyline(map, coordinates);
    showLegs(map, legs);
  } else {
    map.on('load', () => {
      drawPolyline(map, coordinates);
      showLegs(map, legs);
    });
  }
  map.on('mouseenter', 'polyline', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'polyline', () => {
    map.getCanvas().style.cursor = '';
  });
  map.on('click', 'polyline', e => {
    const line = Object.assign([], coordinates);
    const location = [e.lngLat.lng, e.lngLat.lat];
    let closest = findClosest(coordinates, location);
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    splitPolyline(line, closest);
    return;
  });
  if (map.getLayer('chargers'));
  else {
    if (map.getLayer('end')) map.removeLayer('end');
    if (map.getSource('point')) map.removeSource('point');
    if (map.getLayer('clicked-polyline')) map.removeLayer('clicked-polyline');
    if (map.getSource('clicked-source')) map.removeSource('clicked-source');
    showLegs(map, legs);
  }
  return map;
};

/**
 * Create a second polyline up untill the point that was clicked.
 *
 * @param coordinates {array} the coordinates that need to be split
 * @param closest {array} the point at which the coordinates need to be split.
 */
const splitPolyline = (coordinates, closest) => {
  const end = coordinates[closest];
  if (map.getLayer('chargers')) map.removeLayer('chargers');
  if (map.getSource('chargers')) map.removeSource('chargers');
  let clickedRoute = coordinates.splice(0, closest);
  drawClickedLine(map, clickedRoute);
  addLineEnd(map, end);
};
