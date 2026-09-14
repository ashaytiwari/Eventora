'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";

import { UserRole } from "@/lib/constants";

import EventEditor from "../../_components/eventEditor/EventEditor";
import { useEventById } from "../../_components/service";

const EditorContent = () => {

  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const { data: eventData, isLoading } = useEventById(eventId);

  function renderLoadingState() {

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-light-200">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />

        <p className="text-sm font-mono">Loading event details...</p>
      </div>
    );

  }

  function renderEditor() {

    const editorAttributes = {
      mode: (eventId ? "edit" : "create") as "create" | "edit",
      eventId: eventId || undefined,
      initialData: eventData,
    };

    return (
      <EventEditor {...editorAttributes} />
    );

  }

  if (eventId && isLoading) {
    return renderLoadingState();
  }

  return (
    <div className="w-full">

      {renderEditor()}

    </div>
  );

};

const OrganizerEventEditorPage = () => {

  function renderSuspenseFallback() {

    return (
      <div className="flex items-center justify-center min-h-[50vh] text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ORGANIZER]}>
      <div className="flex-1 flex flex-col w-full">

        <Suspense fallback={renderSuspenseFallback()}>
          <EditorContent />
        </Suspense>

      </div>
    </ProtectedRouteAuthGuard>
  );

};

export default OrganizerEventEditorPage;
