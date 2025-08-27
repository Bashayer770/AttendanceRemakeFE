const BASE_URL = 'https://localhost:7092/api';

export const API = {
  LOCATIONS: {
    GET_ALL: `${BASE_URL}/Locations`,
    GET_BY_ID: (code: number) => `${BASE_URL}/Locations/${code}`,
    CREATE: `${BASE_URL}/Locations`,
    UPDATE: (code: number) => `${BASE_URL}/Locations/${code}`,
    DELETE: (code: number) => `${BASE_URL}/Locations/${code}`,
    SEARCH: (query: string) =>
      `${BASE_URL}/Locations/search?query=${encodeURIComponent(query)}`,
  },

  FLOORS: {
    GET_ALL: `${BASE_URL}/Floors`,
    GET_BY_ID: (floor: string) =>
      `${BASE_URL}/Floors/${encodeURIComponent(floor)}`,
    SEARCH: (query: string) =>
      `${BASE_URL}/Floors/search?query=${encodeURIComponent(query)}`,
  },
};
