import { createClient, defaultExchanges } from '@urql/core';
import { getStationsAround } from './queries.js';
import { loadStation, yourLocation } from './map.js';

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

const slow = [1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 2.9, 3, 4.6, 11, 20, 22, 30, 36];
const fast = [43, 50];
const turbo = [100, 120, 135, 150, 350];
const distance = document.getElementById('range');
const amenities = document.querySelectorAll('.amenities input[type=checkbox]');
const amenitiesChecked = document.querySelectorAll('.amenities input[type=checkbox]:checked');
const power = document.querySelectorAll('.power input[type=checkbox]');
let powerChecked = document.querySelectorAll('.power input[type=checkbox]:checked');
let amenitiesOn = [];
let powerOn = [];

for (let i = 0; i < amenitiesChecked.length; i++) {
  amenitiesOn.push(amenitiesChecked[i].getAttribute('id'));
}

for (let index = 0; index < powerChecked.length; index++) {
  if (powerChecked[index].getAttribute('id') == 'slow') addpower(powerOn, slow);
  else if (powerChecked[index].getAttribute('id') == 'fast') addpower(powerOn, fast);
  else if (powerChecked[index].getAttribute('id') == 'turbo') addpower(powerOn, turbo);
}

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
        power: powerOn,
        amenities: amenitiesOn,
      },
    })
    .toPromise()
    .then(response => {
      const stations = response.data.stationAround;
      yourLocation();
      loadStation(stations);
    })
    .catch(error => console.log(error));
};

displayMap();

distance.addEventListener('input', displayMap);

const updateAmenities = () => {
  const attribute = event.target.getAttribute('id');
  let on = document.getElementById(attribute).checked;
  if (on === true) {
    amenitiesOn.push(attribute);
  } else {
    for (let i = 0; i < amenitiesOn.length; i++) {
      if (amenitiesOn[i] === attribute) {
        amenitiesOn.splice(i, 1);
      }
    }
  }
  displayMap();
};

const addpower = (powerOn, list) => {
  list.map(item => powerOn.push(item));
};

const updatePower = () => {
  powerOn = [];
  powerChecked = document.querySelectorAll('.power input[type=checkbox]:checked');
  for (let index = 0; index < powerChecked.length; index++) {
    if (powerChecked[index].getAttribute('id') == 'slow') addpower(powerOn, slow);
    else if (powerChecked[index].getAttribute('id') == 'fast') addpower(powerOn, fast);
    else if (powerChecked[index].getAttribute('id') == 'turbo') addpower(powerOn, turbo);
  }
  displayMap();
};

for (let j = 0; j < amenities.length; j++) {
  amenities[j].addEventListener('change', updateAmenities, false);
}

for (let x = 0; x < power.length; x++) {
  power[x].addEventListener('change', updatePower, false);
}
