export function isLocalDemoEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.DESKVERSE_LOCAL_DEMO !== "false";
}
