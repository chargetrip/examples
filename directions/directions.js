export const createCoordinatesString = data => {
  return data.legs
    .map((leg, i) => {
      if (i === data.legs.length - 1) {
        const [long, lat] = leg.destination.geometry.coordinates;
        return `${long},${lat}`;
      }
      const [long, lat] = leg.origin.geometry.coordinates;
      return `${long},${lat}`;
    })
    .join(';');
};

export const createInstructions = async data => {
  const coordinates = createCoordinatesString(data);
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    body.append('coordinates', coordinates);
    body.append('steps', 'true');
    body.append('waypoints', '0;1;2;3');
    body.append('waypoint_names', ';First Station;Second Station;');
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving?access_token=pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg`,
      {
        method: 'POST',
        headers,
        body,
      },
    );
    const result = await response.json();

    // Create a string containing the HTML for the route instructions.
    let routeInstructions = '';
    result.routes[0].legs.forEach(({ steps }, i) => {
      const instructionsForStep = steps.reduce((acc, { maneuver, distance }, index) => {
        const listItem = `
        <li class="instruction-step">
            <p class="instruction-text">
              <span class="instruction-number">${index + 1}. </span>${maneuver.instruction}</p>
            <p class="instruction-distance">${renderDistance(distance)}</p>
        </li>`;
        return acc + listItem;
      }, `<h2>Directions to ${result.waypoints[i + 1]?.name || 'next stop'}</h2>`);
      routeInstructions = routeInstructions + instructionsForStep;
    });

    // Add the routeInstructions to the instructions div.
    document.getElementById('instructions').innerHTML = `<ol>${routeInstructions}</ol>`;
  } catch (e) {
    console.log('Error', e);
  }
};

function renderDistance(distance) {
  if (distance < 3000) {
    return `${Math.round(distance.toFixed(1))} m`;
  } else {
    return `${Math.round((distance / 1000).toFixed(1))} km`;
  }
}
