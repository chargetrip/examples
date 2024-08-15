# Mutate to create a new route

This example explains how to use our new beta route algorithm.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route starts by executing the `createRoute` mutation. This mutation requires information about the vehicle, origin and destination. After the mutation is finished executing a route `id` will be returned.
2. This `id` can be used to request route updates through the `route` subscription. This subscription receives dynamic updates.
3. After the subscription returns done as status, data can be rendered onto the screen. The `polyline` and the `legs` object will be used to display charge stations on the map. Total distance, duration of a trip, consumption are displayed on the side.
