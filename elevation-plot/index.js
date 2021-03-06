import { drawRoute } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { fetchRoute } from './client';
import { renderRouteHeader, renderRouteDetails, loadGraph } from './elevationGraph';

/**
 * Draw a route on a map.
 *
 * The route object contains `polyline` data -  the polyline encoded route (series of coordinates as a single string).
 * We need to decode this information first. We use Mapbox polyline tool (https://www.npmjs.com/package/@mapbox/polyline) for this.
 * As a result of decoding we get pairs [latitude, longitude].
 * To draw a route on a map we use Mapbox GL JS. This tool uses the format [longitude,latitude],
 * so we have to reverse every pair.
 *
 * @param { object } data - route specification.
 * @param { string } id - route ID.
 */
fetchRoute((routeId, routeData) => {
  drawRoutePolyline(routeId, routeData);
  loadGraph(routeData);
});

const drawRoutePolyline = (id, data) => {
  const decodedData = mapboxPolyline.decode(data?.polyline);
  const reversed = decodedData.map(item => item.reverse());

  drawRoute(id, reversed, data?.legs);
  renderRouteHeader(data);
  renderRouteDetails(data.pathPlot[0]);

  const plotSliderInput = document.getElementById('slider-input');
  const plotSliderOutput = document.getElementById('slider-output');

  plotSliderInput.addEventListener('input', () => {
    renderRouteDetails(data.pathPlot[plotSliderInput.value]);

    const val = plotSliderInput.value;
    const min = plotSliderInput.min ? plotSliderInput.min : 0;
    const max = plotSliderInput.max ? plotSliderInput.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));

    plotSliderOutput.style.left = `calc(${newVal}% + (${11 - newVal * 0.25}px))`;
  });
};
