import type { FounderProfile } from "../domain/types";

export const demoProfile: FounderProfile = {
  id: "current-founder",
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
