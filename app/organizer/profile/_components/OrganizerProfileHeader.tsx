import { Building2, Sparkles, CheckCircle2, Calendar, Mail, ShieldCheck } from "lucide-react";

import { IOrganizerProfileResponse } from "./types";

interface OrganizerProfileHeaderProps {
  profile: IOrganizerProfileResponse | undefined;
  isLoading: boolean;
}

const OrganizerProfileHeader = ({
  profile,
  isLoading,
}: OrganizerProfileHeaderProps) => {

  const containerAttributes = {
    className:
      "w-full bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl p-6 sm:p-8 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden",
  };

  function getInitials(name?: string) {

    if (!name) return "OR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();

  }

  function formatJoinDate(dateStr?: string) {

    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  }

  function renderSkeleton() {

    return (
      <div {...containerAttributes}>
        <div className="flex items-center gap-5 w-full">
          <div className="w-16 h-16 rounded-2xl bg-dark-200/80 animate-pulse shrink-0" />

          <div className="flex flex-col gap-2.5 w-full max-w-md">
            <div className="h-6 bg-dark-200/80 rounded w-48 animate-pulse" />

            <div className="h-4 bg-dark-200/50 rounded w-64 animate-pulse" />
          </div>
        </div>
      </div>
    );

  }

  function renderAvatar() {

    const orgName = profile?.organization?.organizationName || profile?.firstname || "Organization";
    const initials = getInitials(orgName);

    return (
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold text-xl shrink-0 shadow-[0_0_20px_rgba(93,254,202,0.15)]">
        {initials}
      </div>
    );

  }

  function renderOrgInfo() {

    const orgName = profile?.organization?.organizationName || "Organization Profile";
    const tagLine = profile?.organization?.tagLine;
    const representative = `${profile?.firstname || ""} ${profile?.lastname || ""}`.trim();

    return (
      <div className="flex flex-col gap-1.5 max-w-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />

          <span>Verified Host Profile</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {orgName}
        </h1>

        {tagLine && (
          <p className="text-sm text-light-100 font-medium">
            {tagLine}
          </p>
        )}

        <div className="flex items-center gap-4 flex-wrap mt-1 text-xs text-light-200">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />

            <span>{representative || "Host Representative"}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <Mail className="w-3.5 h-3.5 text-light-200/70" />

            <span>{profile?.email}</span>
          </div>
        </div>
      </div>
    );

  }

  function renderBadges() {

    return (
      <div className="flex flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-3.5 h-3.5" />

          <span>Active Organizer</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-light-200 font-mono">
          <Calendar className="w-3.5 h-3.5 text-primary/70" />

          <span>Member since {formatJoinDate(profile?.createdAt)}</span>
        </div>
      </div>
    );

  }

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <div {...containerAttributes}>
      <div className="flex items-start sm:items-center gap-5">

        {renderAvatar()}

        {renderOrgInfo()}

      </div>

      {renderBadges()}
    </div>
  );

};

export default OrganizerProfileHeader;
