// logging_middleware/src/index.ts
// Reusable logging package for Affordmed Campus Evaluation
// This middleware sends structured logs to the Affordmed Test Server

const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

// Valid values as per the evaluation spec
export type Stack = "backend" | "frontend";

export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type Package = BackendPackage | FrontendPackage | SharedPackage;

export interface LogPayload {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

// Token storage — set this before calling Log()
let authToken: string = "";

/**
 * Set the Bearer token to be used for all Log calls.
 * Call this once after obtaining the token from /evaluation-service/auth
 */
export function setAuthToken(token: string): void {
  authToken = token;
}

/**
 * Core reusable Log function.
 * Makes a POST to the Affordmed Test Server log endpoint.
 *
 * @param stack   - "backend" | "frontend"
 * @param level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param pkg     - Package name (see spec for allowed values per stack)
 * @param message - Descriptive log message
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | null> {
  if (!authToken) {
    console.error(
      "[Logger] Auth token not set. Call setAuthToken() before logging."
    );
    return null;
  }

  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `[Logger] Failed to send log. Status: ${response.status}`
      );
      return null;
    }

    const data: LogResponse = await response.json();
    return data;
  } catch (error) {
    console.error("[Logger] Network error while sending log:", error);
    return null;
  }
}

// Convenience wrappers
export const Logger = {
  debug: (stack: Stack, pkg: Package, message: string) =>
    Log(stack, "debug", pkg, message),
  info: (stack: Stack, pkg: Package, message: string) =>
    Log(stack, "info", pkg, message),
  warn: (stack: Stack, pkg: Package, message: string) =>
    Log(stack, "warn", pkg, message),
  error: (stack: Stack, pkg: Package, message: string) =>
    Log(stack, "error", pkg, message),
  fatal: (stack: Stack, pkg: Package, message: string) =>
    Log(stack, "fatal", pkg, message),
};

export default Log;
