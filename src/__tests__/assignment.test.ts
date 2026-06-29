import { describe, expect, it } from "vitest";
import {
  createAvailabilityRequest,
  getAvailablePartners,
  recordAvailabilityResponse
} from "../domain/assignment";
import { sampleCase, samplePartners } from "../domain/sampleData";

describe("assignment workflow", () => {
  it("targets only active partners for the requested role", () => {
    const request = createAvailabilityRequest({
      caseId: sampleCase.id,
      eventDate: "2027-04-18T10:00:00+09:00",
      role: "photographer",
      responseDeadline: "2026-07-09T18:00:00+09:00",
      partners: samplePartners,
      now: "2026-07-02T10:20:00+09:00"
    });

    expect(request.status).toBe("sent");
    expect(request.partnerIds).toEqual(["partner-photo-1", "partner-photo-2"]);
  });

  it("turns available responses into a customer shortlist", () => {
    const request = createAvailabilityRequest({
      caseId: sampleCase.id,
      eventDate: "2027-04-18T10:00:00+09:00",
      role: "photographer",
      responseDeadline: "2026-07-09T18:00:00+09:00",
      partners: samplePartners,
      now: "2026-07-02T10:20:00+09:00"
    });
    const updated = recordAvailabilityResponse(
      request,
      {
        partnerId: "partner-photo-1",
        status: "available",
        respondedAt: "2026-07-02T11:00:00+09:00",
        note: "終日可"
      },
      "2026-07-02T11:00:00+09:00"
    );

    const available = getAvailablePartners(updated, samplePartners);

    expect(updated.status).toBe("ready");
    expect(available.map((partner) => partner.id)).toEqual(["partner-photo-1"]);
  });
});
