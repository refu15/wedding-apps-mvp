import type { Customer, CustomerSharePreview, Meeting, WeddingCase } from "./types";

export function createSharePreview(
  customer: Customer,
  weddingCase: WeddingCase,
  meeting: Meeting
): CustomerSharePreview {
  return {
    customer: {
      primaryName: customer.primaryName,
      partnerName: customer.partnerName,
      preferredContact: customer.preferredContact
    },
    case: {
      title: weddingCase.title,
      status: weddingCase.status,
      weddingDate: weddingCase.weddingDate,
      venueCandidate: weddingCase.venueCandidate,
      stylePreference: weddingCase.stylePreference
    },
    meeting: {
      title: meeting.title,
      scheduledAt: meeting.scheduledAt,
      publicNotes: meeting.publicNotes,
      summary: meeting.summary,
      recordingConsentStatus: meeting.recordingConsent.status
    }
  };
}
