'use client';

import { useSession } from "next-auth/react";
import { AlertCircle, RotateCcw } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

import OrganizerProfileForm from "./_components/OrganizerProfileForm";
import OrganizerProfileHeader from "./_components/OrganizerProfileHeader";
import { useOrganizerProfile } from "./_components/service";

const OrganizerProfilePage = () => {

  const { data: session }: any = useSession();
  const userId = session?.user?.id;

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useOrganizerProfile(userId);

  const containerAttributes = {
    className: "flex-1 flex flex-col w-full max-w-4xl mx-auto pb-16 gap-8",
  };

  const retryButtonAttributes = {
    type: "button" as const,
    onClick: () => refetch(),
    className:
      "inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 transition-colors cursor-pointer",
  };

  const headerAttributes = {
    profile,
    isLoading,
  };

  const formAttributes = {
    profile,
    userId: userId || "",
  };

  function renderErrorState() {

    return (
      <div className="py-16 px-6 rounded-2xl bg-dark-100/50 border border-border-dark flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="text-base font-semibold text-white">
            Failed to load profile details
          </h4>

          <p className="text-xs text-light-200">
            There was an issue fetching your organization information from the server.
          </p>
        </div>

        <button {...retryButtonAttributes}>
          <RotateCcw className="w-3.5 h-3.5" />

          <span>Try Again</span>
        </button>
      </div>
    );

  }

  function renderProfileHeader() {

    return (
      <OrganizerProfileHeader {...headerAttributes} />
    );

  }

  function renderProfileForm() {

    if (isLoading) {
      return null;
    }

    return (
      <OrganizerProfileForm {...formAttributes} />
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ORGANIZER]}>
      <div {...containerAttributes}>

        {renderProfileHeader()}

        {isError && renderErrorState()}

        {!isError && renderProfileForm()}

      </div>
    </ProtectedRouteAuthGuard>
  );

};

export default OrganizerProfilePage;
