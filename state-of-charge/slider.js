import { fetchRoute } from './client';
import { drawRoutePolyline } from './index';

const initialSOC = 435;
const rangeSlider = document.getElementById('range');
const rangeThumb = document.getElementById('range-thumb');
rangeSlider.value = initialSOC;

export const getStateOfCharge = () => rangeSlider.value;

rangeSlider.addEventListener('change', () => {
  fetchRoute(rangeSlider.value, routeData => {
    drawRoutePolyline(routeData);
  });
});
