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
    const cars = response.data;
    console.log(cars.carList[0]);
    const images = cars.carList[0].images;
    images.map(img => {
      if (img.type === 'image_thumbnail') {
        //document.body.appendChild(img.url);
        console.log(img.url);
      }
    });
  })
  .catch(error => console.log(error));

console.log('Car example');
