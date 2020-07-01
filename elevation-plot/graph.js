import Chart from 'chart.js';

/**
 * Calculate where the distance labels should be placed.
 * Here we want to display the distance every 100 m.
 * @param route {object} All data requested about the route.
 */

const createLabelsForElevation = route => {
  const distanceInKm = route.distance / 1000;
  const points = route.elevationPlot.length;
  const pos = 100;
  const label = new Array(points).fill('');
  label[0] = 0;
  for (let i = 1; pos * i < distanceInKm; i++) {
    const x = ((pos * i * points) / distanceInKm).toFixed(0);
    label[x] = pos * i;
  }
  return label;
};

/**
 * Create an elevation Graph using the points from the elevationPlot.
 * @param elevation {array} 100 points of elevation.
 * @param label {array} The labels that will be displayed on the xAxis.
 */

export const loadGraph = (route, elevation) => {
  Chart.defaults.global.defaultFontFamily = 'Inter';
  const ctx = document.getElementById('elevation').getContext('2d');
  let gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(1, '#fff');
  gradient.addColorStop(0, 'rgba(1, 99, 234, 0.4)');
  const data = {
    labels: createLabelsForElevation(route),
    datasets: [
      {
        label: 'elevation',
        borderColor: '#0078FF',
        borderWidth: 1.5,
        backgroundColor: gradient,
        opacity: 0.2,
        pointRadius: 0,
        data: elevation,
      },
    ],
  };
  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            tickMarkLength: 0,
            drawTicks: false,
            drawOnChartArea: false,
            drawBorder: false,
          },
          ticks: {
            min: 0,
            padding: 0,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            fontSize: 14,
            fontStyle: 'bold',
            fontColor: '#404046',
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            tickMarkLength: 0,
            drawTicks: false,
            drawBorder: false,
          },
          ticks: {
            min: 0,
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: -1,
        right: -1,
        top: 0,
        bottom: 0,
      },
    },
    tooltips: {
      enabled: false,
    },
  };
  new Chart(ctx, { type: 'line', data, options });
};

/**
 * This function will display the charging stations within the elevation graph.
 * @param route {object} All information about the route.
 * @param legs {object} The legs of the route.
 */

export const imageLoader = (route, legs) => {
  const elevationGraph = document.getElementById('elevation');
  let chargers = document.getElementById('charge').getContext('2d');
  const img = new Image();
  const len = legs.length - 1;
  let distanceKm = 0;
  img.onload = function() {
    for (let i = 0; i < len; i++) {
      distanceKm = distanceKm + legs[i].distance / 1000;
      let x = (distanceKm * elevationGraph.offsetWidth) / (route.distance / 1000);
      chargers.drawImage(img, x - 15, 0);
    }
  };
  img.src = 'images/station.svg';
};
