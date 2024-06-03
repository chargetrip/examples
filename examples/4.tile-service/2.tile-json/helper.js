/**
 * Converts latitude and longitude coordinates to pixel coordinates using the Web Mercator projection.
 *
 * @param {number} lat - The latitude, in degrees.
 * @param {number} lng - The longitude, in degrees.
 * @param {number} zoom - The zoom level.
 * @returns {number[]} An array containing the x (longitude) and y (latitude) pixel values.
 */
function latLngToPixel(lat, lng, zoom) {
  // Convert latitude to radians.
  const latitudeInRadians = (lat * Math.PI) / 180;

  // Calculate the width of the map in tiles at the given zoom level.
  const mapWidthInTiles = Math.pow(2, zoom);

  // Convert latitude and longitude to pixel coordinates.
  const x = mapWidthInTiles * ((lng + 180) / 360);
  const y =
    (mapWidthInTiles * (1 - Math.log(Math.tan(latitudeInRadians) + 1 / Math.cos(latitudeInRadians)) / Math.PI)) / 2;

  return [x, y];
}
