import { client } from "./client.js";


export const notesApi = {
  getByCase: (caseId)               => client.get(`/cases/${caseId}/notes`),
  add:       (caseId, content, employeeId) =>
    client.post(`/cases/${caseId}/notes`, { content, employeeId }),
};

export const usersApi = {
  getAll:    ()      => client.get("/users"),
  getById:   (id)    => client.get(`/users/${id}`),
  getMe:     ()      => client.get("/users/me"),
  register:  (body)  => client.post("/users/register", body),
  update:    (id, b) => client.put(`/users/${id}`, b),
  delete:    (id)    => client.delete(`/users/${id}`),
};

export const employeesApi = {
  getAll:  ()       => client.get("/employees"),
  getById: (id)     => client.get(`/employees/${id}`),
  create:  (body)   => client.post("/employees", body),
  update:  (id, b)  => client.put(`/employees/${id}`, b),
  delete:  (id)     => client.delete(`/employees/${id}`),
};

export const vehiclesApi = {
  getByUser:  (uid)          => client.get(`/users/${uid}/vehicles`),
  getById:    (uid, vid)     => client.get(`/users/${uid}/vehicles/${vid}`),
  add:        (uid, body)    => client.post(`/users/${uid}/vehicles`, body),
  update:     (uid, vid, b)  => client.put(`/users/${uid}/vehicles/${vid}`, b),
  delete:     (uid, vid)     => client.delete(`/users/${uid}/vehicles/${vid}`),
};
