import { UserRole } from "@/lib/constants";

import AuthGuard from "../auth/AuthGuard";

export default function Page() {

  return (
    <AuthGuard allowedRoles={[UserRole.EVENT_ORGANIZER]}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h3>Event Organizer Home Page</h3>
      </div>
    </AuthGuard>
  );

}