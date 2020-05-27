import qql from 'graphql-tag';

/*
 * In this example we request a route from Amsterdam, Netherlands to Berlin, Germany
 * The changing conditions are:
 *   - full battery at Amsterdam, Germany
 *   - no desired range at Berlin, Germany
 *   - EV can charge at CHadMO changers
 *   - should use climate (temperature and weather conditions)
 *   - the EV driver can drive 40 km  less than the EV specs (specs is 440 km, custom range is 400 km)
 *   - min power of chargers is 43 kWh
 *   - one passenger in the car (drive alone)
 */
export const createRoute = qql`
mutation newRoute{
    newRoute(
      input: {
        ev: {
          id: "5d161be5c9eef46132d9d20a"
          battery: {
            capacity: { value: 72.5, type: kwh }
            stateOfCharge: { value: 72.5, type: kwh }
            finalStateOfCharge: { value: 0, type: kwh }
          }
          plugs: { chargingPower: 150, standard: TESLA_S }
          adapters: [
            { chargingPower: 150, standard: IEC_62196_T2_COMBO }
            { chargingPower: 150, standard: CHADEMO }
          ]
          climate: true
          minPower: 43
          numberOfPassengers: 1
        }
        routeRequest: {
          origin: {
            type: Feature
            geometry: { type: Point, coordinates: [4.8951679, 52.3702157] }
            properties: { name: "Amsterdam, Netherlands" }

          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [13.3888599, 52.5170365] }
            properties: { name: "Berlin, Germany" }
          }
        }
      }
    )
    }
`;

export const routeUpdate = qql`
subscription routeUpdatedById($id: ID!){
  routeUpdatedById(id: $id) {
    status
    route {
      charges
      saving {
        money
        co2
      }
      chargeTime
      distance
      duration
      consumption
      elevationPlot
      elevationUp
      elevationDown
      id
      polyline
      legs{
        distance
        chargeTime
        origin{
          geometry{
            type
            coordinates
          }
        }
        destination{
          geometry
          {
            type
            coordinates
          }
        }
      }
    }
  }
}
`;

export const getRoutePath = (id, location) => `
{
    routePath(
      id: "${id}"
      location: { type: Point, coordinates: [${location}] }
    ) {
      elevation
      avSpeed
      consumptionPerKm
    }
}`;
