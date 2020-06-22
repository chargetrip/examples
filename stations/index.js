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

/**
 * In this example the range, power and amenities are dynamic.
 * A charging station can be slow (< 43 kW), fast (< 100 kW) or turbo.
 * When any of these values is changed we update the map.
 */

const slow = [3, 3.5, 3.6, 3.7, 4, 6, 7, 7.4, 8, 10, 11, 13, 14, 16, 18, 20, 22, 36, 40];
const fast = [43, 45, 50, 60, 80];
const turbo = [100, 120, 15, 129, 135, 150, 175, 200, 250, 350, 400];
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
  if (powerChecked[index].getAttribute('id') == 'slow') {
    addpower(powerOn, slow);
  } else if (powerChecked[index].getAttribute('id') == 'fast') {
    addpower(powerOn, fast);
  } else if (powerChecked[index].getAttribute('id') == 'turbo') {
    addpower(powerOn, turbo);
  }
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

/**
 * Adds all values of that speed to the list of powers we are requesting.
 * @param powerOn {object} All powers that we want to request.
 * @param speed {object} All charging powers that belong to that speed.
 */
const addpower = (powerOn, speed) => {
  speed.map(item => powerOn.push(item));
};

/**
 * Update what power we are requesting and upodate the map.
 */
const updatePower = () => {
  powerOn = [];
  powerChecked = document.querySelectorAll('.power input[type=checkbox]:checked');
  for (let index = 0; index < powerChecked.length; index++) {
    if (powerChecked[index].getAttribute('id') == 'slow') {
      addpower(powerOn, slow);
    } else if (powerChecked[index].getAttribute('id') == 'fast') {
      addpower(powerOn, fast);
    } else if (powerChecked[index].getAttribute('id') == 'turbo') {
      addpower(powerOn, turbo);
    }
  }
  displayMap();
};

const range = document.getElementById('range');
const rangeValue = document.getElementById('rangeV');
const bubble = document.getElementById('range-bubble');
rangeValue.innerHTML = `<span>${range.value / 1000} km</span>`;

/**
 * In order to display the value of the range-slider we have to calculate its position.
 */
const setValue = () => {
  const percent = Number(range.value / 20 / 1000);
  const newPosition = percent * 285;
  rangeValue.innerHTML = `<span>${range.value / 1000} km</span>`;
  bubble.style.left = `calc((${newPosition}px))`;
};

/**
 * Event listeners for all dynamic data.
 */
for (let j = 0; j < amenities.length; j++) {
  amenities[j].addEventListener('change', updateAmenities, false);
}

for (let x = 0; x < power.length; x++) {
  power[x].addEventListener('change', updatePower, false);
}

document.addEventListener('input', setValue);
distance.addEventListener('input', displayMap);
