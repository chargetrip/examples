import mapboxgl from 'mapbox-gl';
import { getDurationString } from '../utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 7.5,
  center: [6, 52.2288],
});

/**
 * Draw route polyline and show charging stations on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const drawRoute = (coordinates, legs, alternatives) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      showLegs(legs);
    });
  }
  document.querySelector('.station-data').addEventListener('click', () => {
    const legend = document.getElementById('legend');
    if (map.getLayer('stations-along-route') && map.getSource('stations-along-route')) {
      document.getElementById('amount').innerHTML = 0;
      map.removeLayer('stations-along-route');
      map.removeSource('stations-along-route');
    } else {
      showAlternatives(alternatives);
      document.getElementById('amount').innerHTML = alternatives.length;
    }
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
      'line-width': 3,
    },
  });
};

/**
 * Show the charging stations, origin and destination on the map.
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
    geometry: legs[0].origin?.geometry,
  });

  legs.map((leg, index) => {
    // add charging stations
    if (index !== legs.length - 1) {
      points.push({
        type: 'Feature',
        properties: {
          icon: 'free-turbo',
        },
        geometry: leg.destination?.geometry,
      });
    } else {
      // add destination point (last leg)
      points.push({
        type: 'Feature',
        properties: {
          icon: 'arrival',
        },
        geometry: leg.destination?.geometry,
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
      'icon-size': 1,
      'icon-offset': ['case', ['==', ['get', 'icon'], 'location_big'], ['literal', [0, 0]], ['literal', [0, -15]]],
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    },
  });
};

/**
 * Icon for the charging station differs base on the speed (slow, fast, turbo),
 * and status(available, busy, unkown or broken).
 * If a charging station has multiple speeds the fastest speed will be shown.
 * @param station {object} Station data
 */
const selectPinlet = station => `along-${station.speed}`;

const showAlternatives = alternatives => {
  if (alternatives.length === 0) return;
  let locations = [];

  alternatives.map(station => {
    locations.push({
      type: 'Feature',
      properties: {
        icon: selectPinlet(station),
      },
      geometry: station.location,
    });
  });
  // draw route points on a map
  map.addLayer({
    id: 'stations-along-route',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: locations,
      },
    },
  });
};
