import { useMemo, useState } from "react";
import { ConnectPanel } from "./components/ConnectPanel";
import { Landing } from "./components/Landing";
import { MatchDetail } from "./components/MatchDetail";
import { MatchResults } from "./components/MatchResults";
import { ProfileWizard } from "./components/ProfileWizard";
import { candidates } from "./data/candidates";
import { demoProfile } from "./data/demoProfile";
import { rankCandidates } from "./domain/ranking";
import type { FounderProfile, MatchResult } from "./domain/types";
import { loadProfile, saveProfile } from "./services/profileStorage";

type Screen = "landing" | "profile" | "matches" | "detail" | "connect";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [profile, setProfile] = useState<FounderProfile | null>(() =>
    loadProfile(),
  );
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const matches = useMemo(
    () => (profile ? rankCandidates(profile, candidates) : []),
    [profile],
  );

  function completeProfile(nextProfile: FounderProfile) {
    saveProfile(nextProfile);
    setProfile(nextProfile);
    setSelectedMatch(null);
    setScreen("matches");
  }

  function useDemoProfile() {
    completeProfile(demoProfile);
  }

  function selectMatch(match: MatchResult) {
    setSelectedMatch(match);
    setScreen("detail");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setScreen("landing")}>
          <span className="brand-mark" aria-hidden="true">F<span>P</span></span>
          <span>FoundPair</span>
        </button>
        <p className="header-note">Better chemistry starts with better context.</p>
        {screen === "landing" ? (
          <button className="button button-small" type="button" onClick={() => setScreen("profile")}>
            Build my profile
          </button>
        ) : null}
      </header>

      {screen === "landing" ? (
        <Landing onStart={() => setScreen("profile")} onDemo={useDemoProfile} />
      ) : null}
      {screen === "profile" ? (
        <ProfileWizard
          initialProfile={profile}
          onCancel={() => setScreen("landing")}
          onComplete={completeProfile}
        />
      ) : null}
      {screen === "matches" && profile ? (
        <MatchResults
          seeker={profile}
          matches={matches}
          onEdit={() => setScreen("profile")}
          onSelect={selectMatch}
        />
      ) : null}
      {screen === "detail" && selectedMatch ? (
        <MatchDetail
          match={selectedMatch}
          onBack={() => setScreen("matches")}
          onConnect={() => setScreen("connect")}
        />
      ) : null}
      {screen === "connect" && profile && selectedMatch ? (
        <ConnectPanel
          seeker={profile}
          match={selectedMatch}
          onBack={() => setScreen("detail")}
        />
      ) : null}
    </div>
  );
}
