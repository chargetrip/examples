import mapboxgl from 'mapbox-gl';
import { fetchRoutePath } from './client';
import { positionElevationIndicator, displaySpecs } from './elevationGraph';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 6,
  center: [7.7, 52],
});

/**
 * Draw route polyline and show the point of origin and destination on the map.
 *
 * @param coordinates {array} Array of coordinates.
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point.
 */
export const drawRoute = (id, coordinates, legs) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      showLegs(legs);
    });
  }

  map.on('mouseenter', 'polyline', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'polyline', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('click', 'polyline', e => {
    const location = [e.lngLat.lng, e.lngLat.lat];
    const [closestPoint, closestPointIndex] = findClosestPoint(coordinates, location);
    const position = closestPointIndex / coordinates.length;

    fetchRoutePath(id, closestPoint).then(data => {
      displaySpecs(data);
    });

    positionElevationIndicator(position);
    splitPolyline([...coordinates], closestPoint, closestPointIndex);
  });
};

/**
 * Draw route polyline on a map.
 *
 * @param coordinates {array} polyline coordinates
 */
const drawPolyline = coordinates => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          properties: {},
          coordinates,
        },
      },
    ],
  };

  map.addSource('polyline-source', {
    type: 'geojson',
    data: geojson,
  });

  map.addLayer({
    id: 'polyline',
    type: 'line',
    options: 'beforeLayer',
    source: 'polyline-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0078FF',
      'line-width': 6,
    },
  });
};

/**
 * Show the origin and destination on the map.
 *
 * The destination of the last leg is the destination point.
 * The origin of the first leg is the origin of our route.
 *
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
const showLegs = legs => {
  if (!legs || legs.length === 0) return;
  let route = [];

  route.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin?.geometry,
  });

  route.push({
    type: 'Feature',
    properties: {
      icon: 'arrival',
    },
    geometry: legs[legs.length - 1].destination?.geometry,
  });

  // draw origin and destination points on a map
  map.addLayer({
    id: 'route',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.9,
      'icon-offset': ['case', ['==', ['get', 'icon'], 'arrival'], ['literal', [0, -15]], ['literal', [0, 0]]],
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: route,
      },
    },
  });
};

/**
 * Create a second polyline up untill the point that was clicked.
 *
 * @param coordinates {array} the coordinates that need to be split.
 * @param closestPoint {array} the point at which the coordinates need to be split.
 */
const splitPolyline = (coordinates, closestPoint, closestPointIndex) => {
  const clickedRoute = coordinates.splice(0, closestPointIndex);

  drawClickedLine(clickedRoute);
  addLineEnd(closestPoint);
};

/**
 * With this function we will mark the route up until the point that was clicked.
 *
 * @param coordinates {array} The coordinates until the point that was clicked.
 */
const drawClickedLine = coordinates => {
  if (map.getLayer('clicked-polyline')) map.removeLayer('clicked-polyline');
  if (map.getSource('clicked-source')) map.removeSource('clicked-source');
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          properties: {},
          coordinates,
        },
      },
    ],
  };

  map.addSource('clicked-source', {
    type: 'geojson',
    data: geojson,
  });

  map.addLayer(
    {
      id: 'clicked-polyline',
      type: 'line',
      source: 'clicked-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#EA8538',
        'line-width': 7,
      },
    },
    'route',
  );
};

/**
 * Display the end of the clicked polyline.
 *
 * @param end {array} The coordinates of the end of the clicked line.
 */
const addLineEnd = end => {
  if (map.getLayer('end')) map.removeLayer('end');
  if (map.getSource('point')) map.removeSource('point');
  map.addSource('point', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: end,
          },
        },
      ],
    },
  });
  map.addLayer({
    id: 'end',
    type: 'symbol',
    source: 'point',
    layout: {
      'icon-image': 'elipse',
      'icon-size': 1.2,
    },
  });
};

/**
 * Find the closest point in the polyline.
 *
 * @param polyline {array} polyline coordinates.
 * @param location {array} the location that was clicked on the polyline.
 */
const findClosestPoint = (polyline, location) => {
  const [x1, y1] = location;
  let closestPoint = Math.sqrt(Math.pow(Math.abs(x1 - polyline[0][0]), 2) + Math.pow(Math.abs(y1 - polyline[0][1]), 2));
  let closestPointIndex = 0;

  for (let i = 1; i < polyline.length - 1; i++) {
    let distance = Math.sqrt(Math.pow(Math.abs(x1 - polyline[i][0]), 2) + Math.pow(Math.abs(y1 - polyline[i][1]), 2));
    if (distance <= closestPoint) {
      closestPoint = distance;
      closestPointIndex = i;
    }
  }

  return [polyline[closestPointIndex], closestPointIndex];
};
