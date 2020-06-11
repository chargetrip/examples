import { displayMap } from './map';

/**
 * For this example we give two providers with different data-sets
 * EcoMovement and Open Charge Map. Users can switch between the two.
 */

let url = window.location.href;
let urlEnd = url.substr(url.lastIndexOf('=') + 1);

if (urlEnd === 'ocm') {
  document.getElementById('ocm').setAttribute('class', 'clicked');
  displayMap({ provider: urlEnd });
} else {
  document.getElementById('eco').setAttribute('class', 'clicked');
  displayMap({ provider: 'urlEnd' }, urlEnd);
}

document.getElementById('eco').addEventListener('click', () => {
  url = '?provider=eco';
  window.location.href = url;
});

document.getElementById('ocm').addEventListener('click', () => {
  url = '?provider=ocm';
  window.location.href = url;
});
