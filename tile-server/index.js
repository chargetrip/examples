import mapboxgl from 'mapbox-gl';

/**
 * For this example we give two providers with different data-sets
 * EcoMovement and Open Charge Map. Users can switch between the two.
 */
const eco = '5ed1175bad06853b3aa1e492';
const ocm = '5e8c22366f9c5f23ab0eff39';
let url = window.location.href;

let urlEnd = url.substr(url.lastIndexOf('?') + 1);

if (urlEnd === 'ocm') {
  document.getElementById('ocm').setAttribute('class', 'clicked');
}
else {
  document.getElementById('eco').setAttribute('class', 'clicked');
};

const getProvider = (urlEnd) => {
  console.log(urlEnd);
  if (urlEnd === 'ocm') return ocm;
  return eco;
};

const getClusterCount = (count) => {
  console.log(count);
  count = parseInt(count);
  console.log(count);
  if (count > 1000) return (count / 1000).toFixed(0);
  else return count;
  
}

/**
 * Mapbox runs 'transformRequest' before it makes a request for an external URL
 * We use this callback to set a client key in the header of the request to Chargetrip API.
 * See example in MapboxGL JS documentation: https://docs.mapbox.com/mapbox-gl-js/api/#requestparameters.
 *
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 3.5,
  center: [4.8979755, 52.367],
  transformRequest: (url, resourceType) => {
    if (resourceType === 'Tile' && url.startsWith('https://api.chargetrip.io')) {
      return {
        url: url,
        headers: {
          'x-client-id': getProvider(urlEnd),
        },
      };
    }
  },
});

/**
 * Display all stations that we request from the Tile Server.
 *
 * For this example we request stations with either a CHADEMO or IEC_62196_T2_COMBO connector.
 * The stations will be clustered.
 * When clicking on a cluster you will zoom in and the map will be centered around that point.
 */

map.on('load', () => {
  map.addSource('stations', {
    type: 'vector',
    tiles: [
      'https://api.chargetrip.io/station/{z}/{x}/{y}/tile.mvt?&connectors[]=CHADEMO&connectors[]=IEC_62196_T2_COMBO',
    ],
  });
    /**
   * The first layer will display a station icon.
   * This layer will only be shown if the cluster count is 1
   */
  map.addLayer({
    id: 'unclustered-stations',
    type: 'symbol',
    layout: {
      'icon-image': 'free-fast-pinlet',
      'icon-size': 0.9,
    },
    source: 'stations',
    'source-layer': 'stations',
  });

  /**
   * This second layer will display the clusterd stations.
   * This layer will be shown as long as the cluster count is above 1.
   */
  map.addLayer({
    id: 'clusters',
    type: 'symbol',
    source: 'stations',
    'source-layer': 'stations',
    interactive: true,
    filter: ['>', ['get', 'count'], 1],
    layout: {
      'icon-image': 'empty-charger',
      'icon-size': 0.9,
      'text-field': [
        'case',
        ['<', ['get', 'count'], 1000],
        ['get', 'count'],
        ['>=', ['get', 'count'], 1000],
        [
          'concat',
          ['to-string', ['round', ['/', ['get', 'count'], 1000]]],
          'K',
        ],
        '-',
      ],
      'text-size': 10,
    },
    paint: {
      'text-color': '#ffffff',
    },
  });
});

/**
 * When clicking on a cluster we will receive its zoom level and coordinates.
 * If our zoom level is less then 9 we will change the zoom level to 9.
 * If the zoom level is between 9 and 13 the zoom level will be changed to 13.
 * The map will always be re-centered around the cluster that was clicked on.
 */
map.on('click', ({ point, target }) => {
  const features = target.queryRenderedFeatures(point, {
    layers: ['clusters', 'unclustered-stations'],
  });
  if (features && features.length > 0 && features[0].properties.count > 1) {
    map.flyTo({
      center: [features[0].properties.lng, features[0].properties.lat],
      zoom: features[0].properties.expansionZoom,
      speed: 1,
    });
  } else if (features && features.length > 0) {
    map.flyTo({
      center: [features[0].properties.lng, features[0].properties.lat],
    });
  }
});

if (urlEnd !== 'ocm') {
  map.on('load', () => {
    map.addSource('eco', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-132 , -71],
              [172, -71],
              [172, 82],
              [-132, 82],
              [-132, -71]
            ],
             [
              [8, 61],
              [11.3, 61],
              [11.3, 45],
              [8, 45],
              [8, 61]
            ]
          ]
        },
      },
    });
    map.addLayer({
      id: 'eco',
      type: 'fill',
      source: 'eco',
      layout: {},
      paint: {
          'fill-color': '#282A30',
          'fill-opacity': 0.60,
      },
    });
  });
};

document.getElementById('eco').addEventListener('click', () => {
  url = '?eco';
  window.location.href = url;
});

document.getElementById('ocm').addEventListener('click', () => {
  url = '?ocm';
  window.location.href = url;
});
