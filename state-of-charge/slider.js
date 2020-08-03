import { fetchRoute } from './client';
import { drawRoutePolyline } from './index';

const initialSOC = 435;
const rangeSlider = document.getElementById('range');
const rangeThumb = document.getElementById('range-thumb');
rangeSlider.value = initialSOC;

export const updateRangeSliderValue = () => {
  const percent = rangeSlider.value / 435;
  const newPosition = percent * rangeSlider.offsetWidth - 70 * percent;
  console.log(newPosition);
  rangeThumb.innerHTML = `${rangeSlider.value} km`;
  rangeThumb.style.left = `calc((${newPosition}px))`;
};

export const getStateOfCharge = () => rangeSlider.value;
rangeSlider.addEventListener('input', () => {
  updateRangeSliderValue();
});
rangeSlider.addEventListener('change', () => {
  document.getElementById('calculating').style.display = 'flex';
  fetchRoute(rangeSlider.value, routeData => {
    drawRoutePolyline(routeData);
  });
});
