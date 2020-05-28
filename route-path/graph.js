import Chart from 'chart.js';

/**
 * Calculate where the ditance labels should be placed.
 * Here we want to display the distance every 100 m.
 * @param route {object} All data requested about the route.
 */

const labels = route => {
  const distance = route.distance / 1000;
  const points = route.elevationPlot.length;
  const pos = 100;
  const label = new Array(points);
  label.fill('');

  for (let i = 1; pos * i < distance; i++) {
    const x = ((pos * i * points) / distance).toFixed(0);
    label[x] = pos * i;
  }
  return label;
};

/**
 * Create an elevation Graph using the point from the elevationPlot.
 * @param elevation {object} 100 points of elevation.
 * @param label {object} The labels that will be displayed on the xAxis.
 */

export const loadGraph = (route, elevation) => {
  const ctx = document.getElementById('elevation').getContext('2d');
  let gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(0, 'rgba(0, 169, 224, 0.3)');
  gradient.addColorStop(1, '#00A9E0');
  const data = {
    labels: labels(route),
    datasets: [
      {
        label: 'elevation',
        backgroundColor: gradient,
        pointRadius: 0,
        data: elevation,
      },
    ],
  };
  const options = {
    scales: {
      xAxes: [
        {
          rangeslider: {},
          gridLines: {
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
            fontSize: 10,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
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
  };
  new Chart(ctx, {
    type: 'line',
    data: data,
    options: options,
  });
};

/**
 * This function will display the charging stations within the elevation graph.
 * @param route {object} All information about the route.
 * @param legs {object} The legs of the route.
 */

export const imageLoader = (route, legs) => {
  let chargers = document.getElementById('charge').getContext('2d');
  const img = new Image();
  const len = legs.length - 1;
  let dis = 0;
  img.onload = function() {
    for (let i = 0; i < len; i++) {
      dis = dis + legs[i].distance / 1000;
      let x = (dis * 250) / (route.distance / 1000);
      chargers.drawImage(img, x, 0, 19, 25);
    }
  };
  img.src = './charger.png';
};
