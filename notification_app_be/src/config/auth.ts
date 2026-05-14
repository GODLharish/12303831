// notification_app_be/src/config/auth.ts
// Handles registration and authentication with the Affordmed Test Server

import { Log, setAuthToken } from "../../logging_middleware/src/index";

const BASE_URL = process.env.TEST_SERVER_URL || "http://4.224.186.213/evaluation-service";

let cachedToken: string = "";
let tokenExpiry: number = 0;

export interface AuthCredentials {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

/**
 * Register with test server to get clientID and clientSecret.
 * Call ONCE - credentials cannot be retrieved again.
 */
export async function register(payload: {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}): Promise<{ clientID: string; clientSecret: string }> {
  Log("backend", "info", "auth", `Attempting registration for ${payload.email}`);

  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    Log("backend", "error", "auth", `Registration failed: status ${response.status}`);
    throw new Error(`Registration failed: ${response.status}`);
  }

  const data = await response.json();
  Log("backend", "info", "auth", "Registration successful. Save clientID and clientSecret now.");
  return { clientID: data.clientID, clientSecret: data.clientSecret };
}

/**
 * Authenticate with test server to get a Bearer token.
 * Token is cached and reused until expiry.
 */
export async function getAuthToken(creds: AuthCredentials): Promise<string> {
  const now = Date.now() / 1000;
  if (cachedToken && now < tokenExpiry - 60) {
    return cachedToken;
  }

  Log("backend", "info", "auth", "Fetching new auth token from test server");

  const response = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: creds.email,
      name: creds.name,
      rollNo: creds.rollNo,
      accessCode: creds.accessCode,
      clientID: creds.clientID,
      clientSecret: creds.clientSecret,
    }),
  });

  if (!response.ok) {
    Log("backend", "fatal", "auth", `Auth failed: status ${response.status}`);
    throw new Error(`Auth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;

  // Set token in logging middleware
  setAuthToken(cachedToken);
  Log("backend", "info", "auth", "Auth token acquired and set in logging middleware");

  return cachedToken;
}

export function getToken(): string {
  return cachedToken;
}
