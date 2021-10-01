import { createRoute, getOperatorList } from './client';
import { attachEventListeners } from './operators';

/**
 * This project shows you how to fetch a car list and render the car details
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

createRoute({});
getOperatorList({ page: 0 });
attachEventListeners();
