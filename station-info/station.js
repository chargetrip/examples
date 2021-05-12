import {
  ConnectorStatus,
  getConnectorStatusLabel,
  getConnectorIcon,
  getConnectorName,
  getConnectorStatus,
  getParkingType,
} from './utils';

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

  const details = [
    {
      title: 'Address',
      subtitle: readableAddress,
      url: googleAddress,
    },
    {
      title: 'Operator',
      subtitle: station.operator?.name,
    },
    {
      title: 'Twenty 4 seven',
      subtitle: station.opening_times?.twentyfourseven ? '24/7' : 'Unknown',
    },
    {
      title: 'Parking',
      subtitle: getParkingType(station.parking_type),
    },
    {
      title: 'Station Id',
      subtitle: station.id,
    },
    {
      title: 'What 3 words',
      subtitle: station.physical_address?.what3Words,
      url: what3wordsURL,
    },
  ];

  renderHeader(station);
  renderConnectors(connectors);
  renderAmenities(station.amenities);
  renderDetails(details);
};

const renderHeader = station => {
  document.getElementById('station-name').innerHTML = station.name;
  document.getElementById('station-operator').innerHTML = station.operator?.name;
};

const renderConnectors = connectors => {
  let connectorList = document.getElementById('connector-list');
  connectorList.replaceChildren();

  connectors.forEach(connector => {
    connectorList.insertAdjacentHTML(
      'afterbegin',
      `
      <li class=${connector.status === ConnectorStatus.UNKNOWN ? 'unknown' : ''}>
        <div class="charger">
          <div class="charger-plug">
            <svg viewBox="0 0 24 24" height="24" width="24">
              <use xlink:href="images/plugs/${connector.icon}.svg#${connector.icon}"></use>
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

const renderAmenities = amenities => {
  let amenityList = document.getElementById('amenity-list');
  amenityList.replaceChildren();

  Object.keys(amenities || {})?.forEach(amenity => {
    console.log(amenity);
    amenityList.insertAdjacentHTML(
      'beforeend',
      `
      <li>
      <div class="amenity">
        <svg viewBox="0 0 24 24" height="24" width="24">
          <use xlink:href="images/amenities/${amenity}.svg#${amenity}"></use>
        </svg>
      </div>
      </li>
      `,
    );
  });
};

const renderDetails = details => {
  let stationDetails = document.getElementById('station-details');
  stationDetails.replaceChildren();

  details.forEach(detail => {
    stationDetails.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        ${detail.url !== undefined ? `<a target="_blank" href=${detail.url}>` : ``}
          <div class="row">
            <p>${detail.title}</p>
          </div>
          <div class="row">
            <p>${detail.subtitle}</p>
          </div>
        ${detail.url !== undefined ? `</a>` : ``}
      </li>
      `,
    );
  });
};
