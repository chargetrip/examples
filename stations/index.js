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

const distance = document.getElementById('range');
const amenities = document.querySelectorAll('.amenities input[type=checkbox]');
const amenitiesChecked = document.querySelectorAll('.amenities input[type=checkbox]:checked');
const power = document.querySelectorAll('.speed input[type=checkbox]');
const powerChecked = document.querySelectorAll('.speed input[type=checkbox]:checked');
let amenitiesOn = [];
let powerOn = [];
const slow = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 2.9, 3, 43];
const fast = [50, 100, 120, 135];
const turbo = [150, 350];

for (let i = 0; i < amenitiesChecked.length; i++) {
  amenitiesOn.push(amenitiesChecked[i].getAttribute('id'));
}

for (let index = 0; index < powerChecked.length; index++) {
  powerOn.push(parseInt(powerChecked[index].getAttribute('id')));
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

const updatePower = () => {
  const item = event.target.getAttribute('id');
  let on = document.getElementById(item).checked;
  if (on === true) {
    powerOn.push(parseInt(item));
  } else {
    for (let i = 0; i < powerOn.length; i++) {
      console.log(powerOn[i]);
      if (powerOn[i] == item) {
        powerOn.splice(i, 1);
      }
    }
  }
  displayMap();
};

for (let j = 0; j < amenities.length; j++) {
  amenities[j].addEventListener('change', updateAmenities, false);
}

for (let x = 0; x < power.length; x++) {
  power[x].addEventListener('change', updatePower, false);
}
