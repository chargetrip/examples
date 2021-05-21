import { fetchRoute } from './client';
import { drawRoutePolyline } from './index';

const rangeSlider = document.getElementById('range');

/**
 * Attach an event listener to our slider to update the current vehicle range
 */
rangeSlider.addEventListener('input', () => {
  const vehicleRange = document.getElementById('vehicle-range');
  vehicleRange.innerHTML = `${rangeSlider.value} km`;
});

/**
 * Attach an event listener that updates our route with the new slider value on release
 */
rangeSlider.addEventListener('change', () => {
  rangeSlider.disabled = true;

  fetchRoute(rangeSlider.value, routeData => {
    drawRoutePolyline(routeData);
    rangeSlider.disabled = false;
  });
});

export const getStateOfCharge = () => rangeSlider.value;
