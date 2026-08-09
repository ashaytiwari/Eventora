import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

export default function Page() {

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.EVENT_ORGANIZER]}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h3>Event Organizer Home Page</h3>
      </div>
    </ProtectedRouteAuthGuard>
  );

}