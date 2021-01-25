import qql from 'graphql-tag';

export const getCarList = qql`
query carList {
  carList(size: 200, page: 0) {
      id
      naming {
        make
        model
        version
        edition
        chargetrip_version
      }
      connectors {
        standard
        power
        time
        speed
      }
      adapters {
        standard
        power
        time
        speed
      }
      battery {
        usable_kwh
        full_kwh
      }
      body {
        seats
      }
      range {
        chargetrip_range {
          best
          worst
       }
      }
      media {
        image {
          id
          type
          url
          height
          width
          thumbnail_url
          thumbnail_height
          thumbnail_width
        }
        brand {
          id
          type
          url
          height
          width
          thumbnail_url
          thumbnail_height
          thumbnail_width
        }
        video {
          id
          url
       }
      }
      routing {
       fast_charging_support
      }
      }
  }
`;
