export const ConnectorName = {
  CHADEMO: 'CHAdeMO',
  DOMESTIC_A: 'Domestic A (Nema)',
  DOMESTIC_B: 'Domestic B (Nema)',
  DOMESTIC_C: 'Domestic C (CEE)',
  DOMESTIC_D: 'Domestic D (IS)',
  DOMESTIC_E: 'Domestic E (CEE)',
  DOMESTIC_F: 'Domestic F (Schuko)',
  DOMESTIC_G: 'Domestic G (UK)',
  DOMESTIC_H: 'Domestic H (SI)',
  DOMESTIC_I: 'Domestic I (AS/MZS)',
  DOMESTIC_J: 'Domestic J (SEV)',
  DOMESTIC_K: 'Domestic K (DS)',
  DOMESTIC_L: 'Domestic L (CEI)',
  IEC_60309_2_single_16: 'CENELEC 16 (Single)',
  IEC_60309_2_three_16: 'CENELEC 16 (Three)',
  IEC_60309_2_three_32: 'CENELEC 32',
  IEC_60309_2_three_64: 'CENELEC 64',
  IEC_62196_T1: 'Type 1 (J1172)',
  IEC_62196_T1_COMBO: 'CCS 1',
  IEC_62196_T2: 'Type 2',
  IEC_62196_T2_COMBO: 'CCS 2',
  IEC_62196_T3A: 'Type 3A',
  IEC_62196_T3C: 'Type 3C',
  PANTOGRAPH_BOTTOM_UP: 'Panto Up',
  PANTOGRAPH_TOP_DOWN: 'Panto Down',
  TESLA_R: 'Tesla R',
  TESLA_S: 'Tesla',
};

export const ConnectorStatus = {
  FREE: 'free',
  BUSY: 'busy',
  UNKNOWN: 'unknown',
  ERROR: 'error',
};

export const ParkingType = {
  ALONG_MOTORWAY: 'Along motorway',
  PARKING_GARAGE: 'Parking garage',
  PARKING_LOT: 'Parking lot',
  ON_DRIVEWAY: 'On driveway',
  ON_STREET: 'On street',
  UNDERGROUND_GARAGE: 'Underground garage',
};

export const getParkingType = type => ParkingType[type] || 'Unknown';
export const getConnectorName = name => ConnectorName[name] || 'Unknown';

export const getConnectorStatus = charger => {
  if (charger.status.free) {
    return ConnectorStatus.FREE;
  } else if (charger.status.busy) {
    return ConnectorStatus.BUSY;
  } else if (charger.status.unknown) {
    return ConnectorStatus.UNKNOWN;
  } else {
    return ConnectorStatus.ERROR;
  }
};

export const gerConnectorStatusLabel = status => {
  switch (status) {
    case ConnectorStatus.FREE:
      return 'Available';
    case ConnectorStatus.BUSY:
      return 'All in use';
    case ConnectorStatus.UNKNOWN:
      return 'Unknown';
    case ConnectorStatus.ERROR:
      return 'Broken';
  }
};
