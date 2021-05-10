import {
  ConnectorStatus,
  getConnectorStatusLabel,
  getAmenityName,
  getConnectorIcon,
  getConnectorName,
  getConnectorStatus,
  getParkingType,
} from './utils';
import Mustache from 'mustache';

/**
 * Display raw station data.
 *
 * Additionally:
 *
 *  - provide address of the station as a Google link (see https://developers.google.com/maps/documentation/urls/get-started#search-action)
 *  - provide direction URL via Google (see https://developers.google.com/maps/documentation/urls/get-started#forming-the-directions-url)
 *  - show amenities
 *  - show connectors availability
 **/
export const displayStationData = data => {
  const { station } = data;

  const what3wordsURL = `https://what3words.com/${station.physical_address?.what3Words}`;
  const readableAddress = data.station?.physical_address?.formattedAddress?.join(', ') || '';
  const googleAddress = `https://www.google.com/maps/search/?api=1&query=${station.coordinates?.latitude},${station.coordinates?.longitude}`;
  const directionURL = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${station.coordinates?.latitude},${station.coordinates?.longitude}`;

  const connectors = station.chargers?.map(charger => {
    const status = getConnectorStatus(charger);
    return {
      name: getConnectorName(charger.standard),
      icon: getConnectorIcon(charger.standard),
      power: charger.power,
      status,
      standard: charger.standard,
      availabilityInfo: `${status === ConnectorStatus.UNKNOWN ? '-' : charger.status[status]}/${charger.total}`,
      availabilityLabel: getConnectorStatusLabel(status),
    };
  });

  const amenities = Object.keys(station.amenities || {})?.map(amenity => {
    return `${getAmenityName(amenity)} • ${station.amenities[amenity]}`;
  });

  // const template = document.getElementById('station-info-template').innerHTML;
  // document.getElementById('stationInfo').innerHTML = Mustache.render(template, {
  //   station: {
  //     ...data.station,
  //     id: station.id,
  //     name: station.name,
  //     operator: station.operator?.name,
  //     connectors,
  //     readableAddress,
  //     googleAddress,
  //     directionURL,
  //     what3Words: station.physical_address?.what3Words,
  //     what3wordsURL,
  //     twenty4seven: station.opening_times?.twentyfourseven ? '24/7' : 'Unknown',
  //     parking: getParkingType(station.parking_type),
  //     amenities,
  //   },
  // });

  console.log(connectors);

  renderConnectors(connectors);
};

const renderConnectors = connectors => {
  let connectorList = document.getElementById('connector-list');
  connectorList.replaceChildren();

  connectors.forEach(connector => {
    connectorList.insertAdjacentHTML(
      'afterbegin',
      `
      <li>
        <div class="charger">
          <div class="charger-plug">
            <svg viewBox="0 0 24 24" height="24" width="24">
              <use xlink:href="images/plug-defs.svg#${connector.icon}"></use>
            </svg>
          </div>

          <div class="charger-details">
            <div class="row">
              <p>${connector.name} • ${connector.power} kW</p>
              <p>${connector.availabilityInfo}</p>
            </div>
            <div class="row">
              <p>€ 2.50 hour + € 0.5 / kWh</p>
              <p>${connector.availabilityLabel}</p>
            </div>
          </div>
        </div>
      </li>
      `,
    );
  });
};

export const showLoader = () => {
  //document.querySelector('#stationInfo .content').innerHTML = "<div class='content empty'>Loading...</div>";
};

export const showError = error => {
  //document.querySelector('#stationInfo .content').innerHTML = `<div class='content empty'>${error}</div>`;
};
