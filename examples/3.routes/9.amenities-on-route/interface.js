import { getDurationString } from '../../../utils';

/**
 * Render journey overview.
 *
 * @param data {object} route specification
 */
export const renderRouteData = data => {
  // Show the side card once the route information has loaded
  const sideCard = document.getElementById('side-card');
  sideCard.style.display = 'block';

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // the total distance of the route, in meters converted to km
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the total energy used of the route, in kWh
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  // the amount of stops in this route
  const routeStops = `${data.charges ?? 0} stops`;

  // A combined field containing several of the route meta data
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;

  const numberOfLegs = data.legs.length;
  // Populate journey overview
  if (data && data.legs) {
    // Show first distance
    document.getElementById('first-leg-distance').innerHTML = `Drive for ${(data.legs[0].distance / 1000).toFixed(
      1,
    )} km`;
    document.getElementById('first-leg-duration').innerHTML = `Approx ${getDurationString(data.legs[0].duration)}`;
    document.getElementById('charging-time').innerHTML = `Charge for ${getDurationString(data.legs[0].chargeTime)}utes`;
    document.getElementById('last-leg-distance').innerHTML = `Drive for ${(
      data.legs[numberOfLegs - 1].distance / 1000
    ).toFixed(1)} km`;
    document.getElementById('last-leg-duration').innerHTML = `Approx ${getDurationString(
      data.legs[numberOfLegs - 1].duration,
    )}`;
  }
};

/**
 * Render a horizontal list of amenity icons
 * @param { Object } amenities - an object that contains all amenities and their details
 */
export const renderAmenityData = amenityData => {
  let amenityName = document.getElementById('restaurant-name');
  let amenityAddress = document.getElementById('restaurant-address');
  let amenityDistance = document.getElementById('restaurant-distance');
  amenityName.innerHTML = amenityData.name;
  amenityAddress.innerHTML = `${amenityData.address.formattedAddress[0]} | ${amenityData.address.country}`;
  amenityDistance.innerHTML = `${amenityData.distance} meters from charging station`;
};
