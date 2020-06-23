/**
 * In this example the range, power and amenities are dynamic.
 * A charging station can be slow (< 43 kW), fast (< 100 kW) or turbo.
 * When any of these values is changed we update the map.
 */

const powers = {
  slow: [3, 3.5, 3.6, 3.7, 4, 6, 7, 7.4, 8, 10, 11, 13, 14, 16, 18, 20, 22, 36, 40],
  fast: [43, 45, 50, 60, 80],
  turbo: [100, 120, 15, 129, 135, 150, 175, 200, 250, 350, 400],
};

export const defaultFilters = {
  distance: 5000,
  power: [],
  amenities: [],
};

/**
 * Update map when filters change
 */
const rangeSlider = document.getElementById('range');
const rangeThumb = document.getElementById('range-thumb');

const updateRangeSliderValue = () => {
  const percent = Number(rangeSlider.value / 20 / 1000);
  const newPosition = percent * 285; //TODO:: magic number :)

  rangeThumb.innerHTML = `${rangeSlider.value / 1000} km`;
  rangeThumb.style.left = `calc((${newPosition}px))`;
};

const getFilters = () => {
  const selectedAmenityInputs = [...document.querySelectorAll('.filters.amenities input[type=checkbox]:checked')];
  const selectedPowerInputs = [...document.querySelectorAll('.filters.power input[type=checkbox]:checked')];

  const selectedAmenities = selectedAmenityInputs.map(input => input.value);
  const selectedPowers = selectedPowerInputs
    .map(input => input.value)
    .reduce((acc, power) => acc.concat(powers[power]), []);

  return {
    distance: parseInt(rangeSlider.value),
    power: selectedPowers,
    amenities: selectedAmenities,
  };
};

export const initFilters = updateFunc => {
  rangeSlider.addEventListener('input', () => {
    updateRangeSliderValue();
    updateFunc(getFilters());
  });

  const filters = [...document.querySelectorAll('.filters input')];
  filters.forEach(input => input.addEventListener('change', () => updateFunc(getFilters())));

  updateRangeSliderValue();
  updateFunc(defaultFilters);
};
