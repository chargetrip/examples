import mapboxgl from 'mapbox-gl';
import { getDurationString } from '../utils';
import { findClosest } from './journey-specs';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 6,
  center: [7.7, 52],
});

/**
 * Draw route polyline and show charging stations on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const drawRoute = (coordinates, legs) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      showLegs(legs);
    });
  }
  map.on('click', 'polyline', e => {
    const line = Object.assign([], coordinates);
    const location = [e.lngLat.lng, e.lngLat.lat];
    let closest = findClosest(coordinates, location);
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    splitPolyline(line, closest);
  });
  map.on('mouseenter', 'polyline', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'polyline', () => {
    map.getCanvas().style.cursor = '';
  });
  return map;
};

/**
 * Draw route polyline on a map.
 *
 * @param coordinates {object} polyline coordinates
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
      'line-width': 3,
    },
  });
};

/**
 * With this function we will mark the route up until the point that was clicked.
 * @param coordinates {object} The coordinates until the point that was clicked.
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

  map.addLayer({
    id: 'clicked-polyline',
    type: 'line',
    options: 'beforeLayer',
    source: 'clicked-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#fff',
      'line-width': 4,
    },
  });
};

/**
 * Show the charging station, origin and destination on the map.
 *
 * Last leg of the route is a destination point.
 * All other legs are either charging stations or via points (if route has stops).
 *
 * @param legs {array} route legs
 */
const showLegs = legs => {
  if (legs.length === 0) return;

  let points = [];

  // we want to show origin point on the map
  // to do that we use the origin of the first leg
  points.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin.geometry,
  });

  legs.map((leg, index) => {
    // add charging stations
    if (index !== legs.length - 1) {
      points.push({
        type: 'Feature',
        properties: {
          description: `${getDurationString(leg.chargeTime)}`,
          icon: 'free-fast-pinlet',
        },
        geometry: leg.destination.geometry,
      });
    } else {
      // add destination point (last leg)
      points.push({
        type: 'Feature',
        properties: {
          icon: 'arrival',
        },
        geometry: leg.destination.geometry,
      });
    }
  });

  // draw route points on a map
  map.addLayer({
    id: 'legs',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': ['case', ['==', ['get', 'icon'], 'free-fast-pinlet'], ['literal', 0.85], ['literal', 0.7]],
      'icon-offset': [
        'case',
        ['==', ['get', 'icon'], 'free-fast-pinlet'],
        ['literal', [0, -13]],
        ['==', ['get', 'icon'], 'arrival'],
        ['literal', [0, -13]],
        ['literal', [0, 0]],
      ],
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    },
  });

  /**
   * Display the charge time on a hover.
   */

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on('mouseenter', 'legs', e => {
    if (e.features[0].properties.icon === 'free-fast-pinlet') {
      map.getCanvas().style.cursor = 'pointer';

      const coordinates = e.features[0].geometry.coordinates;
      const description = e.features[0].properties.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    }
  });

  map.on('mouseleave', 'places', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
};

const splitPolyline = (coordinates, closest) => {
  let clickedRoute = coordinates.splice(0, closest);
  drawClickedLine(clickedRoute);
};
