import mapboxgl from 'mapbox-gl';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 3,
  center: [4.8979755, 52.367],
  transformRequest: (url, resourceType) => {
    if (resourceType === 'Tile' && url.startsWith('https://api.chargetrip.io')) {
      return {
        url: url,
        headers: {
          'x-client-id': '5e8c22366f9c5f23ab0eff39',
        },
      };
    }
  },
});

/**
 * LoadStations will display all stations that we request from the Tile Server
 * For this example we request stations with either a CHADEMO or IEC_62196_T2_COMBO connector
 * The stations will be clustered
 * When clicking on a cluster you will zoom in and the map will be centered around that point
 */
const loadStations = () => {
  map.on('load', function() {
    map.addSource('stations', {
      type: 'vector',
      tiles: [
        'https://api.chargetrip.io/station/{z}/{x}/{y}/tile.mvt?&connectors[]=CHADEMO&connectors[]=IEC_62196_T2_COMBO',
      ],
    });
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'stations',
      'source-layer': 'stations',
      interactive: true,
      filter: ['>', ['get', 'count'], 1],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 9,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });

    map.addLayer({
      id: 'cluster_count',
      type: 'symbol',
      source: 'stations',
      'source-layer': 'stations',
      interactive: true,
      filter: ['>', ['get', 'count'], 1],
      layout: {
        'text-field': '{count}',
        'text-size': 8,
      },
    });

    map.addLayer(
      {
        id: 'unclustered-stations',
        type: 'symbol',
        layout: {
          'icon-image': 'pinlet_free_slow_standard_inactive',
          'icon-size': 0.55,
        },
        source: 'stations',
        'source-layer': 'stations',
        filter: ['>', ['get', 'count'], 0],
      },
      'clusters',
    );
    map.on('click', function({ point, target }) {
      const currentZoom = map.getZoom();
      const features = target.queryRenderedFeatures(point, {
        layers: ['clusters', 'cluster_count', 'unclustered-stations'],
      });
      if (features && features.length > 0 && currentZoom < 9) {
        map.flyTo({
          center: [features[0].properties.lng, features[0].properties.lat],
          zoom: 9,
          speed: 1,
        });
      } else if (features && features.length > 0 && currentZoom >= 9) {
        map.flyTo({
          center: [features[0].properties.lng, features[0].properties.lat],
          zoom: 13,
          speed: 1,
        });
      }
    });
  });
};

export { loadStations };
