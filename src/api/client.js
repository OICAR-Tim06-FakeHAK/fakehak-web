const BASE_URL = import.meta?.env?.VITE_API_URL ?? "http://localhost:8080/api";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function getToken() {
  return sessionStorage.getItem("fhk_token");
}

async function request(method, path, body = undefined) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({ message: "Neispravan odgovor servera" }));

  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? `HTTP ${res.status}`);
  }

  return data;
}

export const client = {
  get:    (path)         => request("GET",    path),
  post:   (path, body)   => request("POST",   path, body),
  put:    (path, body)   => request("PUT",    path, body),
  patch:  (path, body)   => request("PATCH",  path, body),
  delete: (path)         => request("DELETE", path),
};
