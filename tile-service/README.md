# Display all stations with the Tile Server

This tutorial covers a basics of using the Tile Server:

1.  Showing clusters of stations on a map;
2.  Zooming in on the cluster on click

This example is build with JS and requires the basic understanding of GraphQL language. You can read this tutorial ["GraphQL starter quide"]() to see GraphQL in action.

### Preparation

Our Playground has a station database that is populated with freely available European station data from [OCM](https://openchargemap.org/site). Importing your own database or using one of the databased Chargetrip has an integration with, is possible. For more details, contact us. This example will show all stations available within the playground that have CHADEMO or IEC_62196_T2_COMBO connectors.

### Technical stack

For this example we use [urql](https://formidable.com/open-source/urql/) - lightweight GraphQL client.

### Steps to take

Once we have a station database, we can display the stations on the map:

1. We have to fetch the stations from our Tile Server. The Chargetrip Tile Service is a Vector Tile Server that offers a pre-rendered fully clustered charge station solution inlcluding filters to superchargers your station map. For rendering stations on your map, you need to add a set of filters to the tile requests. You can read all the details about the Tile Server in our [Graph API documentation](https://docs.chargetrip.com/#tile-service).
2. After we have accessed the tile server, we can show the stations on a map.

### Useful links

1. Chargetrip GraphAPI [docs](https://docs.chargetrip.com/);
2. Chargetrip GraphAPI [playground](https://playground.chargetrip.com/);
3. Chargetrip GraphAPI schema [information](https://voyager.chargetrip.com/).
