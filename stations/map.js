import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 11,
  center: [4.8979755, 52.3745403],
});

/**
 * Return what icon will be used to display the carging station, depening on the speed and status.
 *
 * @param point {array} Array containing station data
 */

function selectPinlet(point) {
  let charger;
  if (point.speed === 'slow') {
    if (point.status === 'free') {
      charger = 'pinlet_free_slow_standard_inactive';
    } else if (point.status === 'unknown') {
      charger = 'pinlet_unknown_slow_standard_inactive';
    } else if (point.status === 'error') {
      charger = 'pinlet_error_slow_standard_inactive';
    } else {
      charger = 'pinlet_busy_slow_standard_inactive';
    }
  } else if (point.speed === 'fast') {
    if (point.status === 'free') {
      charger = 'pinlet_free_fast_standard_inactive';
    } else if (point.status === 'unknown') {
      charger = 'pinlet_unknown_fast_standard_inactive';
    } else if (point.status === 'error') {
      charger = 'pinlet_error_fast_standard_inactive';
    } else {
      charger = 'pinlet_busy_fast_standard_inactive';
    }
  } else {
    if (point.status === 'free') {
      charger = 'pinlet_free_turbo_standard_inactive';
    } else if (point.status === 'unknown') {
      charger = 'pinlet_unknown_turbo_standard_inactive';
    } else if (point.status === 'error') {
      charger = 'pinlet_error_turbo_standard_inactive';
    } else {
      charger = 'pinlet_busy_turbo_standard_inactive';
    }
  }
  return charger;
}

/**
 * Draw the stations on the map and show data about the station on hover.
 *
 * @param stations {array} Array of stations
 */

function loadStation(stations) {
  let points = new Array(0);
  stations.map(point => {
    let icon = selectPinlet(point);
    points.push({
      type: 'Feature',
      properties: {
        icon: icon,
        description: point.name,
      },
      geometry: {
        type: 'Point',
        coordinates: point.location.coordinates,
      },
    });
  });
  map.addLayer({
    id: 'path',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.55,
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    },
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on('mouseenter', 'path', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    let coordinates = e.features[0].geometry.coordinates.slice();
    let description = e.features[0].properties.description;
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });
  map.on('mouseleave', 'path', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
}

export { loadStation };
