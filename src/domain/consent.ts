import type { Meeting, RecordingConsent, RecordingConsentLog } from "./types";

export function canUseRecordingForAi(meeting: Meeting): boolean {
  return meeting.recordingConsent.status === "granted";
}

export function grantRecordingConsent(
  meeting: Meeting,
  grantedBy: string,
  policyVersion: string,
  now: string
): Meeting {
  return {
    ...meeting,
    recordingConsent: {
      status: "granted",
      grantedBy,
      grantedAt: now,
      policyVersion
    }
  };
}

export function denyRecordingConsent(meeting: Meeting, deniedReason: string): Meeting {
  return {
    ...meeting,
    recordingConsent: {
      status: "denied",
      deniedReason
    }
  };
}

export function createConsentLog(
  customerId: string,
  meeting: Meeting,
  channel: RecordingConsentLog["channel"],
  now: string
): RecordingConsentLog {
  return {
    id: `consent-${meeting.id}-${now.replace(/[^0-9]/g, "")}`,
    customerId,
    meetingId: meeting.id,
    status: meeting.recordingConsent.status,
    policyVersion: getPolicyVersion(meeting.recordingConsent),
    capturedAt: now,
    channel
  };
}

function getPolicyVersion(consent: RecordingConsent): string {
  if (consent.status === "granted") {
    return consent.policyVersion;
  }

  return "unversioned";
}
