export type Commitment = "exploring" | "part-time" | "full-time";
export type StartWindow = "now" | "quarter" | "year";
export type RemotePreference = "remote" | "hybrid" | "local";
export type FundingPreference = "bootstrapped" | "venture" | "open";

export type FounderProfile = {
  id: string;
  name: string;
  headline: string;
  role: string;
  location: string;
  timezone: number;
  remotePreference: RemotePreference;
  commitment: Commitment;
  startWindow: StartWindow;
  offers: string[];
  seeks: string[];
  industries: string[];
  values: string[];
  workStyle: string[];
  fundingPreference: FundingPreference;
  bio: string;
};

export type EligibilityReason =
  | "commitment"
  | "start-window"
  | "location"
  | "role-coverage"
  | "funding";

export type EligibilityResult =
  | { eligible: true; reasons: [] }
  | { eligible: false; reasons: EligibilityReason[] };

export type DimensionScores = {
  complementarity: number;
  values: number;
  goals: number;
  workStyle: number;
  logistics: number;
  overall: number;
};

export type ScoreBand =
  | "Strong fit"
  | "Promising fit"
  | "Worth exploring"
  | "Not recommended";

export type MatchExplanation = {
  summary: string;
  strengths: string[];
  friction: string;
  questions: [string, string, string];
};

export type MatchResult = {
  profile: FounderProfile;
  scores: DimensionScores;
  band: Exclude<ScoreBand, "Not recommended">;
  explanation: MatchExplanation;
};
