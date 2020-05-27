# Build a route with Chargetrip API

This tutorial expands on the route example. It will not only show a route on a map but also display information about the journey specs:

1.  showing a route on a map along with the charging stations;
2.  showing an elevation plot;
3.  showing information about a journey spec;
4.  Updating the journey specs for a specific location in journey, when you click on that point.

This example is build with JS and requires the basic understanding of GraphQL language. You can read this tutorial ["GraphQL starter quide"]() to see GraphQL in action.  
You can see it up and running [here](https://chargetrip.github.io/examples/route/).

### Preparation

To build a route, you will need a car (the associated consumption model of a car will be applied to the routing engine), station database, origin and a destination.

For the purpose of this example, we use **Tesla Model S**, **Amsterdam** as an origin and **Berlin** as a destination point. If you want to expand this example and select another car, please look in the [API documentation](https://docs.chargetrip.com/#cars) on how to do so.

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site) so you can try planning routes across Europe. Importing your own database or using one of the databased Chargetrip has an integration with, is possible. For more details, contact us.

### Technical stack

For this example we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.

### Steps to take

Once we have a car and station database, we can start planning the route:

1. We have to request a new route. The `newRoute` mutation is used for that. We will need to pass car information, origin and destination. As a result we will get ID of a new route. You can read all the details about this mutation in our [Graph API documentation](https://docs.chargetrip.com/#request-a-new-route).
2. With a route ID we can request route information. We will subscribe to a route update to receive dynamic updates for it (recommended route, alternative routes (if available), time duration, consumption etc). You can read all the details about this subscription in our [Graph API documentation](https://docs.chargetrip.com/#subscribe-to-route-updates).
3. Having the route details, we can show a route on a map. To show stations, where a car must stop for charging, we use the route `legs` object, where each leg has an origin and a destination.
4. With the route details we can create an elevation graph using the `elevationPlot` object. This object will give you a hundred points of elevation. To display the graph we use [chartJS](https://www.chartjs.org/docs/latest/) in this example.
5. Now we can show the route on a map. We use [MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/overview/#quickstart) in this example.
6. With the route ID and a specific location within the polyline we can request information about that route path segment using the `routePath` query. We use this to display information like elevation, consumption and the average speed. With every click on the polyline we send a new request and update the journey specs.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
