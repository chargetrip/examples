import qql from 'graphql-tag';

/*
 * In this example we request a route from Amsterdam, Netherlands to Utrecht, Netherlands
 * The changing conditions are:
 *   - full battery at Amsterdam, Netherlands
 *   - no desired range at Utrecht, Netherlands
 *   - EV can charge at CHadMO changers
 *   - should use climate (temperature and weather conditions)
 *   - the EV driver can drive 40 km  less than the EV specs (specs is 440 km, custom range is 400 km)
 *   - min power of chargers is 43 kWh
 *   - one passenger in the car (drive alone)
 *   - stations along the route radius is 2km
 */
export const createRoute = qql`
mutation newRoute{
    newRoute(
      input: {
        ev: {
          id: "5d161be5c9eef46132d9d20a"
          battery: {
            capacity: { value: 72.5, type: kwh }
            stateOfCharge: { value: 2.5, type: kwh }
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
            geometry: { type: Point, coordinates: [5.1214, 52.0907] }
            properties: { name: "Utrecht, Netherlands" }
          }
          stationsAlongRouteRadius: 2000
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
      distance
      duration
      consumption
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
      stationsAlongRoute{
        location{
          type
          coordinates
        }
        speed
        status
        distance
      }
    }
  }
}
`;
