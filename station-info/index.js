import { createClient, defaultExchanges } from '@urql/core';
import { getStationData } from './queries.js';
import Mustache from 'mustache';
// eslint-disable-next-line max-len
import {
  getParkingType,
  getConnectorStatus,
  ConnectorStatus,
  gerConnectorStatusLabel,
  getConnectorName,
} from './utils';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  'x-client-id': '5ed1175bad06853b3aa1e492',
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
 * Fetch station data by its ID
 */
const fetchStationData = id =>
  client
    .query(getStationData, {
      stationId: id,
    })
    .toPromise()
    .then(response => {
      return response.data;
    })
    .catch(error => console.log(error));

/* We fetch station in Amsterdam */
fetchStationData('5ed118a8b899ae12f698152d').then(data => displayStationData(data));

/**
 * Display raw station data.
 *
 * Additionally:
 *
 *  - provide address of the station as a Google link (see https://developers.google.com/maps/documentation/urls/get-started#search-action)
 *  - provide direction URL via Google (see https://developers.google.com/maps/documentation/urls/get-started#forming-the-directions-url)
 **/
const displayStationData = data => {
  const { station } = data;
  console.log(station);

  const what3wordsURL = `https://what3words.com/${station.physical_address?.what3Words}`;
  const readableAddress = data.station?.physical_address?.formattedAddress?.join(', ') || '';
  const googleAddress = `https://www.google.com/maps/search/?api=1&query=${station.coordinates?.latitude},${station.coordinates?.longitude}`;
  const directionURL = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${station.coordinates?.latitude},${station.coordinates?.longitude}`;

  const connectors = station.chargers?.map(charger => {
    const status = getConnectorStatus(charger);
    return {
      name: getConnectorName(charger.standard),
      power: charger.power,
      status,
      standard: charger.standard,
      availabilityInfo: `${status === ConnectorStatus.UNKNOWN ? '-' : charger.status[status]}/${charger.total}`,
      availabilityLabel: gerConnectorStatusLabel(status),
    };
  });

  const template = document.getElementById('station-info-template').innerHTML;
  document.getElementById('station-info').innerHTML = Mustache.render(template, {
    station: {
      ...data.station,
      id: station.id,
      name: station.name,
      operator: station.operator?.name,
      connectors,
      readableAddress,
      googleAddress,
      directionURL,
      what3Words: station.physical_address?.what3Words,
      what3wordsURL,
      twenty4seven: station.opening_times?.twentyfourseven ? '24/7' : '',
      parking: getParkingType(station.parking_type),
    },
  });
};
