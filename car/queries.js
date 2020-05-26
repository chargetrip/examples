import qql from 'graphql-tag';

export const getCarList = qql`
query carList {
    carList(size: 10, page: 0) {
      id
      externalId
      make
      carModel
      edition
      version
      topSpeed
      images{
        type
        url
      }
    }
  }
`;
