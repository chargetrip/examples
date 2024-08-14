import qql from 'graphql-tag';

/*
 * In this example we request a route from Hanover, Germany to Nørresundby, Denmark
 * Your origin and destination are required fields. You also need to select an EV.
 * Only the EV ID here is mandatory, all other fields are optional and when not specified will use the default values.
 * The changing conditions are:
 *   - full battery at Hanover, Germany
 *   - EV can charge at CHAdeMO changers
 *   - should use climate (temperature and weather conditions)
 *   - min power of chargers is 43 kWh. This is the default setting
 *   - one passenger in the car (drive alone)
 */
export const createRouteQuery = qql`
  mutation createRoute {
      createRoute(
        input: {
          vehicle: {
            id: "5d161be5c9eef46132d9d20a"
            charging: {
                connectors: [{
                    standard: TESLA_S
                    max_charge_speed: {
                      type: kilowatt_hour
                      value: 150
                    }
                }]
                adapters: [
                    {
                      standard: IEC_62196_T2_COMBO
                      max_charge_speed: {
                          type: kilowatt_hour
                          value: 150
                      }
                    }
                    {
                      standard: CHADEMO
                      max_charge_speed: {
                          type: kilowatt_hour
                          value: 150
                      }
                    }
                ]
            }
            climate: true
          }
          origin: {
            type: Feature
            geometry: { type: Point, coordinates: [9.732625731357011, 52.3806314590276] }
            properties: { 
              location: {
                name: "Hanover, Germany" 
              }
              vehicle: {
                occupants: 1
              }
            }
          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [9.922192327081783, 57.046057998779176] }
            properties: { 
              location: {
                name: "Aalborg, Denmark"
              }
            }
          }
        }
      )
    }
  `;

export const routeUpdateSubscription = qql`
  subscription route($id: ID!){
    route(id: $id) {
      status
      recommended {
        tags
        charges
        savings {
          money
        }
        durations {
        total
        driving
        charging
        }
        distance
        consumption
        polyline (decimals: five)
        legs {
          durations {
            charging
          }
          origin{
            geometry{
              type
              coordinates
            }
            properties {
              station_id
            }
          }
          destination{
            geometry
            {
              type
              coordinates
            }
            properties {
              station_id
            }
          }
        }
      }
    }
  }
  `;
