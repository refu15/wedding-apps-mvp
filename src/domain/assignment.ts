import type {
  AvailabilityRequest,
  AvailabilityResponse,
  Partner,
  PartnerRole
} from "./types";

type AvailabilityRequestInput = {
  caseId: string;
  eventDate: string;
  role: PartnerRole;
  responseDeadline: string;
  partners: Partner[];
  now: string;
};

export function createAvailabilityRequest(input: AvailabilityRequestInput): AvailabilityRequest {
  const partnerIds = input.partners
    .filter((partner) => partner.status === "active" && partner.role === input.role)
    .map((partner) => partner.id);

  return {
    id: `availability-${input.caseId}-${input.role}-${input.eventDate.replace(/[^0-9]/g, "")}`,
    caseId: input.caseId,
    eventDate: input.eventDate,
    role: input.role,
    status: partnerIds.length > 0 ? "sent" : "draft",
    responseDeadline: input.responseDeadline,
    partnerIds,
    responses: [],
    createdAt: input.now,
    updatedAt: input.now
  };
}

export function recordAvailabilityResponse(
  request: AvailabilityRequest,
  response: AvailabilityResponse,
  now: string
): AvailabilityRequest {
  const responses = [
    ...request.responses.filter((item) => item.partnerId !== response.partnerId),
    response
  ];
  const hasAvailable = responses.some((item) => item.status === "available" || item.status === "tentative");

  return {
    ...request,
    responses,
    status: hasAvailable ? "ready" : "collecting",
    updatedAt: now
  };
}

export function getAvailablePartners(
  request: AvailabilityRequest,
  partners: Partner[]
): Partner[] {
  const availableIds = new Set(
    request.responses
      .filter((response) => response.status === "available" || response.status === "tentative")
      .map((response) => response.partnerId)
  );

  return partners.filter((partner) => availableIds.has(partner.id));
}

export function expireAvailabilityRequest(
  request: AvailabilityRequest,
  now: string
): AvailabilityRequest {
  if (new Date(now).getTime() <= new Date(request.responseDeadline).getTime()) {
    return request;
  }

  return {
    ...request,
    status: request.status === "ready" ? "ready" : "expired",
    updatedAt: now
  };
}
