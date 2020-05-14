export { getStationsAround };

const getStationsAround = `
{
stationAround(
    query: {
      location: { type: Point, coordinates: [4.8979755, 52.3745403] }
      distance: 5000
      amenities: ["supermarket"]
    }
    size: 10
    page: 0
  ) {
    id
    external_id
    name
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
`