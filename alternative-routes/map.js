import mapboxgl from 'mapbox-gl';
import { displayRouteData } from './index';
import { getDurationString } from '../utils';

// eslint-disable-next-line no-undef
mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

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

/**
 * Draw route polyline and show charging stations on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const drawRoutes = routes => {
  if (map.loaded()) {
    routes.forEach((route, index) => drawPolyline(route, index, index === 0 ? '#EA8538' : '#0078FF'));
    map.moveLayer(`0`);
    showLegs(routes[0].data.legs);
  } else {
    map.on('load', () => {
      routes.forEach((route, index) => drawPolyline(route, index, index === 0 ? '#EA8538' : '#0078FF'));
      map.moveLayer(`0`);
      showLegs(routes[0].data.legs);
    });
  }
  for (let i = 0; i < routes.length; i++) {
    map.on('mouseenter', `${i}`, e => {
      map.getCanvas().style.cursor = 'pointer';
      const coordinates = e.lngLat;
      const description =
        `${getDurationString(routes[i].data.duration ?? 0)}` + '</br>' + `${routes[i].data.charges ?? 0} stops`;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('click', `${i}`, () => {
      map.setPaintProperty(`${i}`, 'line-color', '#0078FF');
      for (let j = 0; j < routes.length; j++) {
        if (j !== i) {
          map.setPaintProperty(`${j}`, 'line-color', '#EA8538');
        }
      }
      map.moveLayer(`${i}`);
      showLegs(routes[`${i}`].data.legs);
      displayRouteData(routes[`${i}`].data);
    });

    map.on('mouseleave', `${i}`, () => {
      map.getCanvas().style.cursor = '';
    });
  }
};

/**
 * Draw a polyline on a map.
 *
 * @param routes {object} All routes recieved from the route query
 * @param index {number} The index of the route that should be drawn
 */
const drawPolyline = (route, index, linecolor) => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          properties: {
            description: route.data.duration + ' ' + route.data.charges,
          },
          coordinates: route.polyline,
        },
      },
    ],
  };

  map.addSource(`${index}`, {
    type: 'geojson',
    lineMetrics: true,
    data: geojson,
  });

  map.addLayer({
    id: `${index}`,
    type: 'line',
    options: 'beforeLayer',
    source: `${index}`,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': linecolor,
      'line-width': 5,
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
  if (map.getLayer('legs')) map.removeLayer('legs');
  if (map.getSource('legs')) map.removeSource('legs');

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
