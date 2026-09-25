// Shared by the contact form (client) and /api/contact (server), so the two
// can never disagree about which topics exist or how long a field may be.

export const topics = [
  { id: "parent", label: "I’m a parent or expecting", subject: "A question from a parent" },
  { id: "launch", label: "Tell me when the app launches", subject: "Tell me when ParentVeda launches" },
  { id: "doctors", label: "I’m a doctor or run a clinic", subject: "ParentVeda+ for my clinic" },
  { id: "employers", label: "I’m an employer", subject: "Sponsoring ParentVeda for our team" },
  { id: "brands", label: "I’m from a brand", subject: "Brand partnership with ParentVeda" },
  { id: "press", label: "Press or media", subject: "Press enquiry" },
  { id: "other", label: "Something else", subject: "A message for ParentVeda" },
] as const;

export type TopicId = (typeof topics)[number]["id"];

export const limits = { name: 80, email: 120, phone: 20, org: 120, message: 3000 } as const;

export type ContactPayload = {
  topic: TopicId;
  name: string;
  email: string;
  phone?: string;
  org?: string;
  message: string;
  consent: boolean;
  // spam guards — never shown to people
  website?: string; // honeypot: a real person never fills a field they cannot see
  startedAt?: number; // when the form was first shown; bots submit instantly
};

export function isTopic(x: unknown): x is TopicId {
  return topics.some((t) => t.id === x);
}

export function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x);
}

// Returns a field → message map; empty means valid.
export function validate(p: Partial<ContactPayload>) {
  const errors: Record<string, string> = {};
  if (!isTopic(p.topic)) errors.topic = "Choose what this is about.";
  if (!p.name?.trim()) errors.name = "Tell us your name.";
  else if (p.name.length > limits.name) errors.name = "That name is too long.";
  if (!p.email?.trim()) errors.email = "We need an email to reply to.";
  else if (!isEmail(p.email) || p.email.length > limits.email) errors.email = "That email doesn’t look right.";
  if (p.phone && (p.phone.length > limits.phone || !/^[+\d\s()-]{6,}$/.test(p.phone))) errors.phone = "That number doesn’t look right.";
  if (p.org && p.org.length > limits.org) errors.org = "That’s too long.";
  if (!p.message?.trim() || p.message.trim().length < 10) errors.message = "Write a little more, so we can help.";
  else if (p.message.length > limits.message) errors.message = `Keep it under ${limits.message} characters.`;
  if (!p.consent) errors.consent = "Tick this so we’re allowed to reply.";
  return errors;
}
