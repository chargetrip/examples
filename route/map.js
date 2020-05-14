export { drawMap };

mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
    zoom: 5.5,
    center: [8.7320104, 52.3758916],
});

function drawMap(reversed, legs) {
    loadLegs(legs);
    loadPoly(reversed);
    loadMarkers(legs)
}

function loadPoly(reversed) {
    const geojson = ({
        'type': 'FeatureCollection',
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'properties': {},
                'coordinates': reversed
            }
        }]
    })
    map.on('load', function() {
        map.addSource('LineString', {
            'type': 'geojson',
            'data': geojson
        });
        map.addLayer({
            'id': 'LineString',
            'type': 'line',
            'options': 'beforeLayer',
            'source': 'LineString',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#00A9E0',
                'line-width': 3
            },
        }, 'path')
    });
}

function loadLegs(legs) {
    let points = new Array(0);
    points.push(({
        type: 'Feature',
        properties: {
            icon: 'location_big',
        },
        geometry: {
            type: 'Point',
            coordinates: legs[0].origin.geometry.coordinates
        }
    }));
    legs.map((point, index) => {
        if (index < legs.length - 1) {
            points.push(({
                type: 'Feature',
                properties: {
                    icon: 'pinlet',
                    'description': index + 1,
                },
                geometry: {
                    type: 'Point',
                    coordinates: point.destination.geometry.coordinates
                }
            }))
        } else {
            points.push(({
                type: 'Feature',
                properties: {
                    icon: 'destination',

                },
                geometry: {
                    type: 'Point',
                    coordinates: point.destination.geometry.coordinates
                }
            }))
        }
    });
    map.addLayer({
        id: 'path',
        type: 'symbol',
        "layout": {
            "icon-image": '{icon}',
            "icon-allow-overlap": true,
            'icon-size': 0.55,
            "icon-offset": [
                "case", ["==", ["get", "icon"], "pinlet"],
                ["literal", [50, -20]],
                ["==", ["get", "icon"], "destination"],
                ["literal", [0, -20]],
                ["literal", [0, 0]]
            ],
            'text-field': ['get', 'description'],
            'text-allow-overlap': true,
            'text-offset': [-0.35, -1.6],
            'text-size': 9,
        },
        "paint": {
            "text-color": "#FFFFFF",
        },
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: points
            }
        }
    });
}

function loadMarkers(legs) {
    const max = legs.length;
    let el = document.createElement('div');
    el.innerHTML = "<p> To <br> <strong> Berlin </strong></p>";
    el.className = 'location-label';
    new mapboxgl.Marker(el, { offset: [-20, -45] })
        .setLngLat(legs[max - 1].destination.geometry.coordinates)
        .addTo(map);
    for (let i = 0; i < max; i++) {
        let el = document.createElement('div');
        let text;
        let offset;
        if (i === 0) {
            text = "<p> From <br> <strong> Amsterdam </strong></p>"
            el.className = 'location-label';
            offset = [+30, -30];
        } else {
            text = "<p><strong>" + (legs[i - 1].chargeTime / 60).toFixed(0) + " min </strong>  charge</p>";
            el.className = 'rounded-label';
            offset = [+35, -18];
        }
        el.innerHTML = text;
        new mapboxgl.Marker(el, { offset: offset })
            .setLngLat(legs[i].origin.geometry.coordinates)
            .addTo(map);
    }
}