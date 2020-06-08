import { displayMap } from './map';

/**
 * For this example we give two providers with different data-sets
 * EcoMovement and Open Charge Map. Users can switch between the two.
 */
const eco = '5ed1175bad06853b3aa1e492';
const ocm = '5e8c22366f9c5f23ab0eff39';
let url = window.location.href;

let urlEnd = url.substr(url.lastIndexOf('?') + 1);

if (urlEnd === 'ocm') {
  document.getElementById('ocm').setAttribute('class', 'clicked');
  displayMap(ocm, urlEnd);
} else {
  document.getElementById('eco').setAttribute('class', 'clicked');
  displayMap(eco, urlEnd);
}

document.getElementById('eco').addEventListener('click', () => {
  url = '?eco';
  window.location.href = url;
});

document.getElementById('ocm').addEventListener('click', () => {
  url = '?ocm';
  window.location.href = url;
});
