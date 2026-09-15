const legacySslModes = new Set(["prefer", "require", "verify-ca"]);

/**
 * Keeps the current pg-connection-string behavior explicit while older
 * environment files are still using an aliased sslmode value.
 */
export function normalizePostgresConnectionString(connectionString: string): string {
  return connectionString.replace(
    /([?&]sslmode=)(prefer|require|verify-ca)(?=(&|$))/gi,
    (_match, prefix: string, mode: string) => `${prefix}${legacySslModes.has(mode.toLowerCase()) ? "verify-full" : mode}`,
  );
}
