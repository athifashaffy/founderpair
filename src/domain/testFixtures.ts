import type { FounderProfile } from "./types";

export const seeker: FounderProfile = {
  id: "seeker",
  name: "Avery Chen",
  headline: "Product-minded engineer",
  role: "Technical founder",
  location: "Toronto",
  timezone: -4,
  remotePreference: "remote",
  commitment: "full-time",
  startWindow: "now",
  offers: ["Engineering", "Product"],
  seeks: ["Sales", "Growth"],
  industries: ["Climate", "SaaS"],
  values: ["Customer focus", "Transparency", "Ambition"],
  workStyle: ["Async", "Fast-paced", "Data-informed"],
  fundingPreference: "venture",
  bio: "I build products and want a commercial partner for a climate SaaS company.",
};

export const candidate: FounderProfile = {
  id: "candidate",
  name: "Maya Brooks",
  headline: "Go-to-market leader",
  role: "Commercial founder",
  location: "New York",
  timezone: -4,
  remotePreference: "remote",
  commitment: "full-time",
  startWindow: "now",
  offers: ["Sales", "Growth", "Fundraising"],
  seeks: ["Engineering", "Product"],
  industries: ["Climate", "Fintech"],
  values: ["Customer focus", "Transparency", "Ambition"],
  workStyle: ["Async", "Fast-paced", "Data-informed"],
  fundingPreference: "venture",
  bio: "I turn early customer insight into repeatable go-to-market systems.",
};
