# Get an elevation profile of your route with the Chargetrip API

This tutorial expands on the route example. It will not only show a route on a map but also display journey specifications, and elevation levels:

1.  Display a route on a map;
2.  Display an elevation plot;
3.  Display information about a specific point in your journey;
4.  Updating the journey specs for a specific location in your journey, using the slider.

To see this example live 👉 [demo](https://examples.chargetrip.com/?id=elevation-plot/).

### Technical stack

The Chargetrip API is built around GraphQL. If you're not familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API. This getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.
We use our Playground environment for this example. It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Preparation

To build a route, you will need a car (the associated consumption model of a vehicle will be applied to the routing algorithm), station database, origin, and a destination.

For this example, we use **Tesla model S**, **Hanover, Germany** as an origin, and **Aalborg, Denmark** as a destination point.
Chargetrip operates an extensive database of EVs, each with their specific consumption models. You can find more information about our database and available queries by checking [Chargetrip API documentation](https://developers.chargetrip.com/).

Our Playground has a station database that is populated with a small set of EcoMovement data. Importing your own database or using one of the databases Chargetrip has an integration with, is possible. For more details, contact us.

### Steps to take

Once we have a car and station database, we can start planning the route:

1. We have to request a new route. The `newRoute` mutation is used for that. We will need to pass information about the car, origin and destination. As a result we will get the ID of a new route. You can read all the details about this mutation in our [Graph API documentation](https://developers.chargetrip.com/API-Reference/Routes/mutate-route).
2. With a route ID we can request route information. We will subscribe to a route update to receive dynamic updates for it (recommended route, alternative routes (if available), time duration, consumption etc). You can read all the details about this subscription in our [Graph API documentation](https://developers.chargetrip.com/API-Reference/Routes/subscribe-to-route-updates).
3. Having the route details, we can show a route on a map. To show the origin and the destination, we use the route `legs` object, where each leg has an origin and a destination.
4. With the route details we can create an elevation graph using the `elevationPlot` array. This array will give you a hundred points of elevation. To display the graph we use [chartJS](https://www.chartjs.org/docs/latest/) in this example.
5. The pathPlot property on the route query gives you back consumption, elevation, speed data, and more, for a 100 points on your route. We have used this data to create an elevation graph. To see the specific consumption, elevation or speed at a specific point you can move the slider.

### Useful links

1. Chargetrip GraphAPI [docs](https://developers.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
