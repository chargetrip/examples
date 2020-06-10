import mapboxgl from 'mapbox-gl';
import { getDurationString } from '../utils';

/**
 * Draw route polyline on a map.
 *
 * @param coordinates {object} polyline coordinates
 */
export const drawPolyline = (map, coordinates) => {
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
export const drawClickedLine = (map, coordinates) => {
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
      options: 'beforeLayer',
      source: 'clicked-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#EA8538',
        'line-width': 4,
      },
    },
    'route',
  );
};

/**
 * Show the charging station, origin and destination on the map.
 *
 * Last leg of the route is a destination point.
 * All other legs are either charging stations or via points (if route has stops).
 *
 * @param legs {array} route legs
 */
export const showLegs = (map, legs) => {
  if (legs.length === 0) return;

  let route = [];
  let points = [];

  // we want to show origin point on the map
  // to do that we use the origin of the first leg
  route.push({
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
      route.push({
        type: 'Feature',
        properties: {
          icon: 'arrival',
        },
        geometry: leg.destination.geometry,
      });
    }
  });

  // draw origin and destination points on a map
  map.addLayer({
    id: 'route',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.7,
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

  map.addLayer({
    id: 'chargers',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.85,
      'icon-offset': [0, -15],
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

  map.on('mouseenter', 'chargers', e => {
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
  });

  map.on('mouseleave', 'chargers', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
};

export const addLineEnd = (map, end) => {
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
      'icon-size': 1,
    },
  });
};
