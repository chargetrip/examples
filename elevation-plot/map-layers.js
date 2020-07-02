/**
 * Draw route polyline on a map.
 *
 * @param coordinates {array} polyline coordinates
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
      'line-width': 6,
    },
  });
};

/**
 * With this function we will mark the route up until the point that was clicked.
 * @param coordinates {array} The coordinates until the point that was clicked.
 * @param map {object}
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
 * Show the charging station, origin and destination on the map.
 *
 * Last leg of the route is a destination point.
 * All other legs are either charging stations or via points (if the route has stops).
 * @param map {object}
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const showLegs = (map, legs) => {
  if (legs.length === 0) return;

  let route = [];
  let points = [];

  // we want to show the origin point on the map
  // to do that we use the origin of the first leg
  route.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin.geometry,
  });
  route.push({
    type: 'Feature',
    properties: {
      icon: 'arrival',
    },
    geometry: legs[legs.length - 1].destination.geometry,
  });

  // draw origin and destination points on a map
  if (!map.getLayer('route')) {
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
  }
};

/**
 * Display the end of the clicked polyline.
 * @param map {object}
 * @param end {array} The coordinates of the end of the clicked line.
 */
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
      'icon-size': 1.2,
    },
  });
};
