import qql from 'graphql-tag';

/*
 * In this example we request a route from Hamburg, Germany to Aarhus, Denmark
 * We request all amenity stops to have a bathroom
 * We also request for a coffee stop after an hour, plus a restaurant after 3 hours
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
                duration: 2000,
                stop_after: 5000,
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
