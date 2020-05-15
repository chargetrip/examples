import { createClient, defaultExchanges } from '@urql/core';
import { getStationsAround } from './queries.js';
import { loadStation } from './map.js';

/**
 * For the purpose of this example we use urgl lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
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

/*
 * 1. Query all stations around your location
 */
client
  .query(getStationsAround)
  .toPromise()
  .then(response => {
    const stations = response.data.stationAround;
    console.log(stations);
    loadStation(stations);
  })
  .catch(error => console.log(error));
