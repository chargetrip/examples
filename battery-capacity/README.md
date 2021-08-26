# Change your state of charge (SOC) and recalculate the route

This tutorial covers the basics of building a route and showing how your battery capacity effects the route:

1.  show a route on a map;
2.  show charging stations;
3.  show a slider that changes your EVs battery capacity.

To see this example live 👉 [demo](https://chargetrip.github.io/examples/state-of-charge/).

### Technical stack

The Chargetrip API is built around GraphQL. If you're not familiar with GraphQL, [going over the specs](https://graphql.org/learn/) will be helpful. Don't worry, you don't need to be an expert to use this API, this getting started guide should be enough to get going.

To see our Chargetrip API in action, you can go to the [Playground](https://playground.chargetrip.com/). It has a big collection of mutations/queries for you to experience the power of our API.

This example is built with vanilla JS. To establish a connection with Chargetrip API, we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.
We use our Playground environment for this example. It means that only part of our extensive database is available. You need a registered `x-client-id` to access the full database.

### Preparation

To build a route, you will need a car (the associated consumption model of a vehicle will be applied to the routing algorithm), station database, origin, and a destination.

For this example, we use **Tesla model S**, **Hanover, Germany** as an origin, and **Aalborg, Denmark** as a destination point.
Chargetrip operates an extensive database of EVs, each with their specific consumption models. You can find more information about our database and available queries by checking [Chargetrip API documentation](https://developers.chargetrip.com/API-Reference/Cars/introduction).

Our Playground has a station database that is populated with small set of EcoMovement station data. Importing your own database or using one of the databases Chargetrip has an integration with, is possible. For more details, contact us.

### Steps to take

Once we have a car and station database, we can start planning the route:

1. We have to request a new route. For that we use the `newRoute` mutation. We will need to pass information about the car including the battery capacity, origin and destination. The battery capacity is a variable in this mutation. As a result we will get an ID of a newly created route. You can read all the details about this mutation in our [Chargetrip API documentation](https://developers.chargetrip.com/API-Reference/Routes/mutate-route).
2. With a route ID we can request route information and show the route on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.
3. Using the slider we can request a new route when the battery capacity changes and show how this effects the route.

### Important note

At the moment you are allowed to exceed the -20% and +20% battery capacity range. Though we advise you to stay within these ranges to make sure a reasonable route with optimized charge points will be provided.

### Useful links

1. Chargetrip API [docs](https://developers.chargetrip.com/)
2. Chargetrip API Playground [playground](https://playground.chargetrip.com/)
3. Chargetrip API schema [information](https://voyager.chargetrip.com/).
