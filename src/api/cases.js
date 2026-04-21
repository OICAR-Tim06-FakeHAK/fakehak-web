import { client } from "./client.js";

export const casesApi = {
  getAll:        ()           => client.get("/cases"),
  getActive:     ()           => client.get("/cases/active"),
  getByStatus:   (status)     => client.get(`/cases/status/${status}`),
  getByUser:     (userId)     => client.get(`/cases/user/${userId}`),
  getById:       (id)         => client.get(`/cases/${id}`),

  /** @param {{ userId, vehicleId, latitude, longitude, description? }} body */
  create:        (body)       => client.post("/cases", body),

  updateStatus:  (id, status) => client.patch(`/cases/${id}/status`, { status }),
  updateLocation:(id, lat, lng) => client.patch(`/cases/${id}/location`, { latitude: lat, longitude: lng }),
  assign:        (id, empId)  => client.patch(`/cases/${id}/assign`, { employeeId: empId }),
};
