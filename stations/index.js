import { createClient, defaultExchanges } from '@urql/core';
import { getStationsAround } from './queries.js';
import { loadStation } from './map.js';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  'x-client-id': '5e8c22366f9c5f23ab0eff39',
};

const client = createClient({
  url: 'https://api.chargetrip.io/graphql',
  fetchOptions: {
    method: 'POST',
    headers,
  },
  exchanges: [...defaultExchanges],
});

const distance = document.getElementById('range');
const amenitiesChecked = document.querySelectorAll('.amenities input[type=checkbox]:checked');
const amenities = document.querySelectorAll('.amenities input[type=checkbox]');
let amenitiesOn = [];

for (var i = 0; i < amenitiesChecked.length; i++) {
  amenitiesOn.push(amenitiesChecked[i].getAttribute('id'));
}

console.log(amenitiesOn);
/**
 * In this example we fetch the closest stations around Oudekerksplein, 1012 GZ Amsterdam, Noord-Holland, Netherlands
 * with a radius of 5000 meters which have a supermarket and
 * at least one connector of 50 kWh or 22 kWh
 */
const displayMap = () => {
  client
    .query(getStationsAround, {
      query: {
        location: { type: 'Point', coordinates: [4.8979755, 52.3745403] },
        distance: parseInt(distance.value),
        power: [50, 22],
        amenities: amenitiesOn,
      },
    })
    .toPromise()
    .then(response => {
      const stations = response.data.stationAround;
      loadStation(stations);
    })
    .catch(error => console.log(error));
};

displayMap();

const myFunction = () => {
  var attribute = event.target.getAttribute('id');
  let on = document.getElementById(attribute).checked;
  console.log(attribute);
  console.log(on);
  if (on === true) {
    amenitiesOn.push(attribute);
    console.log(amenitiesOn);
  } else {
    for (var i = 0; i < amenitiesOn.length; i++) {
      if (amenitiesOn[i] === attribute) {
        amenitiesOn.splice(i, 1);
      }
    }
  }
  console.log(amenitiesOn);
  displayMap();
};

distance.addEventListener('input', displayMap);

for (var j = 0; j < amenities.length; j++) {
  amenities[j].addEventListener('change', myFunction, false);
}
