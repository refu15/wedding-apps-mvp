import type {
  AvailabilityRequest,
  Customer,
  MessageLog,
  Partner,
  WeddingCase
} from "./types";

export function queueAvailabilityMessages(
  request: AvailabilityRequest,
  partners: Partner[],
  weddingCase: WeddingCase,
  now: string
): MessageLog[] {
  const recipients = partners.filter((partner) => request.partnerIds.includes(partner.id));

  return recipients.map((partner) => ({
    id: `message-${request.id}-${partner.id}`,
    channel: partner.contactChannel,
    recipientType: "partner",
    recipientId: partner.id,
    template: "availability_request",
    status: "queued",
    body: `${weddingCase.title}の${request.eventDate}について、対応可否を${request.responseDeadline}までに回答してください。`,
    createdAt: now,
    sentAt: null
  }));
}

export function queueCustomerShareMessage(
  customer: Customer,
  body: string,
  now: string
): MessageLog {
  return {
    id: `message-customer-share-${customer.id}-${now.replace(/[^0-9]/g, "")}`,
    channel: customer.preferredContact === "email" ? "email" : "line",
    recipientType: "customer",
    recipientId: customer.id,
    template: "customer_share",
    status: "queued",
    body,
    createdAt: now,
    sentAt: null
  };
}

export function markMessagesSent(messages: MessageLog[], ids: string[], now: string): MessageLog[] {
  const targetIds = new Set(ids);

  return messages.map((message) =>
    targetIds.has(message.id)
      ? {
          ...message,
          status: "sent",
          sentAt: now
        }
      : message
  );
}
