const BASE_URL = 'https://localhost:7092/api';
const ROOT_URL = 'https://localhost:7092';

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

  NODES: {
    GET_ALL: `${ROOT_URL}/Nodes/GetNodeList`,
    GET_BY_SERIAL: (serial: string) =>
      `${ROOT_URL}/Nodes/GetNodeBySerial?serial=${encodeURIComponent(serial)}`,
    CREATE: `${ROOT_URL}/Nodes/AddNewNode`,
    UPDATE: (serial: string) =>
      `${ROOT_URL}/Nodes/UpdateNode/${encodeURIComponent(serial)}`,
    DELETE: (serial: string) =>
      `${ROOT_URL}/Nodes/DeleteNode/${encodeURIComponent(serial)}`,
  },

  ATTENDANCE: {
    GET_ATTENDANCE_RECORD: (startDate: string, endDate: string) =>
      `${BASE_URL}/Attendances/GetAttendanceRecord?startDate=${encodeURIComponent(
        startDate
      )}&EndDate=${encodeURIComponent(endDate)}`,
    GET_LATE_RECORD: (user: string, startDate: string, endDate: string) =>
      `${BASE_URL}/Attendances/GetLateRecord?user=${encodeURIComponent(
        user
      )}&startDate=${encodeURIComponent(
        startDate
      )}&EndDate=${encodeURIComponent(endDate)}`,
  },
};
