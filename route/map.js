import mapboxgl from 'mapbox-gl';
import { getDurationString } from '../utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 5,
  center: [8.1320104, 52.3758916],
});

// Display the charge time on a hover
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on('mouseenter', 'legs', e => {
  if (e.features[0]?.properties?.icon !== 'arrival' && e.features[0]?.properties?.icon !== 'location_big') {
    map.getCanvas().style.cursor = 'pointer';

    const coordinates = e.features[0]?.geometry?.coordinates;
    const description = e.features[0]?.properties?.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  }
});

map.on('mouseleave', 'legs', function() {
  map.getCanvas().style.cursor = '';
  popup.remove();
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
    lineMetrics: true,
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
      'line-color': 'red',
      'line-width': 8,
      // 'line-gradient' must be specified using an expression
      // with the special 'line-progress' property
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        'blue',
        0.1,
        'royalblue',
        0.3,
        'cyan',
        0.5,
        'lime',
        0.7,
        'yellow',
        1,
        'red',
      ],
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
    geometry: legs[0].origin?.geometry,
  });

  legs.map((leg, index) => {
    // add charging stations
    if (index !== legs.length - 1) {
      points.push({
        type: 'Feature',
        properties: {
          description: `${getDurationString(leg.chargeTime)}`,
          icon: 'unknown-turbo',
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
      'icon-size': ['case', ['==', ['get', 'icon'], 'location-big'], ['literal', 0.7], ['literal', 0.8]],
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
