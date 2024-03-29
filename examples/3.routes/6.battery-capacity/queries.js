import qql from 'graphql-tag';

/*
 * In this example we request a route from Hanover, Germany to Aalborg, Denmark
 * Your origin and destination are required fields. You also need to select an EV.
 * Only the EV ID here is mandatory, all other fields are optional and when not specified will use the default values.
 * The conditions are:
 *   - full battery at Hanover, Germany
 *   - EV can charge at CHAdeMO and T2 Combo changers
 *   - should use climate (temperature and weather conditions)
 *   - min power of chargers is 43 kWh. This is the default setting
 *   - one passenger in the car (drive alone)
 *   - an adjustable battery capacity
 */
export const createRoute = qql`
mutation newRoute($capacity: Float!){
  newRoute(
    input: {
      ev: {
        id: "5d161be5c9eef46132d9d20a"
        battery: {
          stateOfCharge: { value: $capacity, type: kwh }
          capacity: { value: $capacity, type: kwh }
        }
        plugs: { chargingPower: 150, standard: TESLA_S }
        adapters: [
          { chargingPower: 150, standard: IEC_62196_T2_COMBO }
          { chargingPower: 150, standard: CHADEMO }
        ]
        climate: true
        numberOfPassengers: 1
      }
      routeRequest: {
        origin: {
          type: Feature
          geometry: { type: Point, coordinates: [9.732625731357011, 52.3806314590276] }
          properties: { name: "Hanover, Germany" }

        }
        destination: {
          type: Feature
          geometry: { type: Point, coordinates: [9.922192327081783, 57.046057998779176] }
          properties: { name: "Aalborg, Denmark" }
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
      distance
      duration
      consumption
      polyline
      legs{
        chargeTime
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
      }
    }
  }
}
`;
