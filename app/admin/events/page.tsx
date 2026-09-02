import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";

import { UserRole } from "@/lib/constants";

export default function AdminEventsPage() {

  function renderPageHeader() {

    return (
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>

        <p className="text-light-200 text-sm">View, moderate, and manage all events on Eventora.</p>
      </div>
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div className="flex-1 flex flex-col w-full">

        {renderPageHeader()}

        <div className="bg-dark-100/50 border border-border-dark rounded-xl p-8 text-center text-light-200">
          <p>Admin events management panel.</p>
        </div>

      </div>
    </ProtectedRouteAuthGuard>
  );

}
