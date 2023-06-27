import qql from 'graphql-tag';

/*
 * In this example we request a route from Hamburg, Germany to Aarhus, Denmark
 * We request a restaurant stop after just under an hour and a half of driving (5000 seconds)
 */
export const createRouteQuery = () => {
  return qql`
mutation newRoute{
    newRoute(
      input: {
        ev: {
          id: "5f043b76bc262f1627fc025b"
          battery: {
            stateOfCharge: {
                value: 100,
                type: percentage
            },
            finalStateOfCharge: {
                value: 10,
                type: percentage
            }
          }
          numberOfPassengers: 2
        }
        routeRequest: {
          amenity_preferences: {
            scheduled_charge_stops: [
              {
                types: [restaurant],
                duration: 2400,
                offset: 2100,
                stop_after: 3600,
                max_distance_from_station: 1000
              }
            ],
          },
          origin: {
            type: Feature
            geometry: { type: Point, coordinates: [9.9872, 53.5488] }
            properties: { name: "Hamburg, Germany" }
          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [10.2039, 56.1629] }
            properties: { name: "Aarhus, Denmark" }
          }
        }
      }
    )
  }
`;
};

export const routeUpdateSubscription = qql`
subscription routeUpdatedById($id: ID!){
  routeUpdatedById(id: $id) {
    status
    route {
      tags
      charges
      saving {
        money
        co2
      }
      chargeTime
      distance
      duration
      consumption
      polyline
      legs{
        type
        rangeStartPercentage
        rangeEndPercentage
        plugsAvailable
        plugsCount
        duration
        distance
        chargeTime
        steps {
          distance
          duration
        }
        origin{
          geometry{
            type
            coordinates
          }
          properties
        }
        destination{
          geometry
          {
            type
            coordinates
          }
          properties
        }
        stationId
      }
    }
  }
}
`;

export const getStationDataQuery = qql`
query station($stationId: ID!){
  station(id: $stationId) {
    id
    name
    chargers {
      status {
        free
      }
      total
    }
    amenities
    status
  }
}
`;

export const getAmenityListQuery = qql`
  query amenityList($stationId: ID!) {
    amenityList(stationId: $stationId) {
      name
      distance
      address {
        formattedAddress
        country
      }
    }
  }
  `;
