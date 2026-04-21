import { client } from "./client.js";

export const authApi = {
  /** @param {{ identifier: string, password: string }} creds */
  login: (creds) => client.post("/auth/login", creds),
};
