import { createClient, defaultExchanges } from '@urql/core';
import { getCarList } from './queries.js';

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

client
  .query(getCarList)
  .toPromise()
  .then(response => {
    const cars = response.data.carList;
    cars.map(car => {
      displayCarData(car);
    });
  })
  .catch(error => console.log(error));

const displayCarData = car => {
  console.log(car);
  const img = car.images[0].url;
  //The make model and image of the car.
  document.getElementById('make').innerHTML = car.make;
  document.getElementById('model').innerHTML = car.carModel;
  document.getElementById('car-image').src = img;

  //Car details
  document.getElementById('range').innerHTML = '---';
  document.getElementById('battery').innerHTML = car.batteryUsableKwh + ' kWh';
  document.getElementById('efficiency').innerHTML = car.batteryEfficiency.average + ' kWH / 100 km';
  document.getElementById('plug').innerHTML = car.connectors[0].standard;

  //Weather data
  document.getElementById('city-mild').innerHTML = car.range.best.city + ' km';
  document.getElementById('city-cold').innerHTML = car.range.worst.city + ' km';
  document.getElementById('highway-mild').innerHTML = car.range.best.highway + ' km';
  document.getElementById('highway-cold').innerHTML = car.range.worst.highway + ' km';
  document.getElementById('combined-mild').innerHTML = car.range.best.combined + ' km';
  document.getElementById('combined-cold').innerHTML = car.range.worst.combined + ' km';

  //performance
  document.getElementById('acceleration').innerHTML = car.acceleration + ' s';
  document.getElementById('topspeed').innerHTML = car.topSpeed + ' km/h';
  document.getElementById('power').innerHTML = car.power + ' KW';
  document.getElementById('torque').innerHTML = car.torque + ' Nm'
};
