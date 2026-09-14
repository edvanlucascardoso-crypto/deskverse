import "server-only";

import { platformServiceStatus, readPlatformEnvironment } from "./env";

export function getPlatformHealth() {
  const services = platformServiceStatus(readPlatformEnvironment());
  const configured = services.filter((service) => service.configured).length;
  return {
    status: services.every((service) => service.configured) ? "ready" : configured > 0 ? "partial" : "local",
    checkedAt: new Date().toISOString(),
    services,
    note: "Healthcheck de configuração; conexões externas continuam atrás dos contratos de serviço.",
  } as const;
}
