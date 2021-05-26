import mapboxgl from 'mapbox-gl';
import { renderRouteDetails } from './index';
import { getDurationString } from '../utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 6.8,
  center: [8.8320104, 47.9758916],
});

// Display the charge time on a hover
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

/**
 * Draw route polyline and show charging stations on the map.
 * @param { array } routes - The route and alternative routes between two points
 */
export const drawRoutes = routes => {
  const routeOptions = document.querySelectorAll('.tab');
  const tabHighlighter = document.getElementById('tab-highlighter');

  if (map.loaded()) {
    routes.forEach((route, index) => drawPolyline(route, index, index === 0 ? '#0078FF' : '#9CA7B2'));
    map.moveLayer(`0`);
    showLegs(routes[0].data.legs);
  } else {
    map.on('load', () => {
      routes.forEach((route, index) => drawPolyline(route, index, index === 0 ? '#0078FF' : '#9CA7B2'));
      map.moveLayer(`0`);
      showLegs(routes[0].data.legs);
    });
  }

  for (let i = 0; i < routes.length; i++) {
    map.on('mouseenter', `${i}`, e => {
      map.getCanvas().style.cursor = 'pointer';
      const coordinates = e.lngLat;
      const description =
        `<strong>${getDurationString(routes[i].data.duration ?? 0)}` +
        ` • ` +
        `${routes[i].data.charges ?? 0} stops</strong>`;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('click', `${i}`, () => {
      tabHandler(routeOptions, i, tabHighlighter);
      highlightRoute(i, routes);
    });

    map.on('mouseleave', `${i}`, () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  }

  routeOptions.forEach((option, index) => {
    option.addEventListener('click', e => {
      e.preventDefault();
      tabHandler(routeOptions, index, tabHighlighter);
      highlightRoute(index, routes);
    });
  });
};

/**
 * Small helper function that sets the font color and tab highlight
 * @param { object } routeOptions - All possible route options that are available in the tabs
 * @param { number } index - Current active index
 * @param { element } tabHighlighter - The highlight element that indicates the active tab
 */
const tabHandler = (routeOptions, index, tabHighlighter) => {
  routeOptions.forEach(option => option.classList.remove('active'));
  routeOptions[index].classList.add('active');
  tabHighlighter.style.transform = `translateX(calc(${index * 100}% + ${index * 2}px)`;
};

/**
 * Draw the polyline on the map
 * @param { object } route - All the route data to draw the route
 * @param { number } index - The current index of the route we are going to draw
 * @param { string } linecolor - The line color in a hex string
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
 * Helper function that draws the legs of a route. Allows us to show charging stations, origin and destination
 * Last leg of the route is always a destination point
 * All other legs are either charging stations or via points (if route has additional stops)
 *
 * @param { array } legs - The legs of the route
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
      'icon-ignore-placement': true,
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

/**
 * Highlight the route that was clicked.
 *
 * @param { object } routes - All routes recieved from the route query
 * @param { number } id - index / id of the polyline that was clicked on
 */
const highlightRoute = (id, routes) => {
  map.setPaintProperty(`${id}`, 'line-color', '#0078FF');
  for (let j = 0; j < routes.length; j++) {
    if (j !== id) {
      map.setPaintProperty(`${j}`, 'line-color', '#9CA7B2');
    }
  }
  map.moveLayer(`${id}`);
  showLegs(routes[id].data.legs);
  renderRouteDetails(routes[id].data);
};
