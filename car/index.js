import { createClient, defaultExchanges } from '@urql/core';
import { getCarList } from './queries.js';
import Mustache from 'mustache';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives an access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
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

client
  .query(getCarList)
  .toPromise()
  .then(response => {
    const cars = response.data.carList;
    displayCarData(cars);
  })
  .catch(error => console.log(error));

const displayCarData = cars => {
  let profiles = [];

  cars.map(car => {
    profiles.push({
      make: car.make,
      model: car.carModel,
      image: car.images[0].url,
      range: car.range.best.city + ' km',
      battery: car.batteryUsableKwh + ' kWh',
      efficiency: car.batteryEfficiency.average + ' kWh',
      plug: car.connectors[0].standardd,
      cityMild: car.range.best.city + ' km',
      cityCold: car.range.worst.city + ' km',
      highwayMild: car.range.best.highway + ' km',
      highwayCold: car.range.worst.highway + ' km',
      combinedMild: car.range.best.combined + ' km',
      combinedCold: car.range.worst.combined + ' km',
      acceleration: car.acceleration + ' s',
      topspeed: car.topSpeed + ' Km/h',
      power: car.power + ' KW',
      torque: car.torque + ' Nm',
    });
  });

  let template = document.getElementById('template').innerHTML;
  let rendered = Mustache.render(template, {
    carProfile: profiles,
  });
  document.getElementById('target').innerHTML = rendered;
};
