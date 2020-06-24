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
    cars.map(car => {
      displayCarData(car);
    });
  })
  .catch(error => console.log(error));

const displayCarData = car => {
  let template = document.getElementById('template').innerHTML;
  let rendered = Mustache.render(template, { make: car.make });
  document.getElementById('target').innerHTML = rendered;
};
