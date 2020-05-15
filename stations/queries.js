import qql from 'graphql-tag';

/*
 * In this example we request stations around Amsterdam
 * The  station conditions are:
 *   - Around the coordinats: [4.8979755, 52.3745403]
 *   - Within 5000 meters
 *   - power of chargers is 50 or 22 kWh
 *   - amenities : supermarket
 */

export const getStationsAround = qql`
{
stationAround(
    query: {
      location: { type: Point, coordinates: [4.8979755, 52.3745403] }
      distance: 5000
      power: [50, 22]
      amenities: ["supermarket"]
    }
    size: 10
    page: 0
  ) {
    id
    external_id
    address
    location {
      type
      coordinates
    }
    elevation
    amenities
    power
    speed
    status
    }
}
`;
