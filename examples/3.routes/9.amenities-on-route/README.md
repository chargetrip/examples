# Add amenities to your route

I need coffee! The kids need a bathroom break! Feed me or I'll end it all! Common complaints heard whilst driving. With amenity-based-routing, your caffeine/bathroom/food/other needs can be catered too, all whilst you charge your vehicle.

## Requirements

- [Chargetrip API key](https://account.chargetrip.com) - to plot routes outside this region
- [Mapbox API key](https://www.mapbox.com) - to display the map
- [URQL](https://formidable.com/open-source/urql/) - a lightweight graphQL client

## Steps to take

1. Plotting a route starts by executing the `newRoute` mutation. This mutation requires information about the car, origin and destination. After the mutation is finished executing a route `id` will be returned. Here the amenity preferences for the route should be added.
2. This `id` can be used to request route updates through the `routeUpdatedById` subscription. This subscription receives dynamic updates.
3. After the subscription returns done as status, data can be rendered onto the screen. The `polyline` and the `legs` object will be used to display charge stations on the map. Total distance, duration of a trip, consumption are displayed on the side.
4. The amenities are also displayed underneath the relevant station for the end user to see.
5. Using the `route.leg.type` property, it's possible to check if a leg ends at an amenity.

## Next steps

This example shows how routing can be supplemented by adding amenities during certain charging stops. Next, let's move on from routing and dive in to the tile service.
