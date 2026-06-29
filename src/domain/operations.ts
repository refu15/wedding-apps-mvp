import type { AuditLog, OperationalError, UserRole } from "./types";

export function createAuditLog(input: {
  actorRole: UserRole;
  action: string;
  entityType: AuditLog["entityType"];
  entityId: string;
  detail: string;
  now: string;
}): AuditLog {
  return {
    id: `audit-${input.action}-${input.entityId}-${input.now.replace(/[^0-9]/g, "")}`,
    actorRole: input.actorRole,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    detail: input.detail,
    createdAt: input.now
  };
}

export function createOperationalError(input: {
  area: OperationalError["area"];
  severity: OperationalError["severity"];
  message: string;
  now: string;
}): OperationalError {
  return {
    id: `error-${input.area}-${input.now.replace(/[^0-9]/g, "")}`,
    area: input.area,
    severity: input.severity,
    message: input.message,
    status: "open",
    createdAt: input.now
  };
}

export function resolveOperationalError(errors: OperationalError[], errorId: string): OperationalError[] {
  return errors.map((error) =>
    error.id === errorId
      ? {
          ...error,
          status: "resolved"
        }
      : error
  );
}
