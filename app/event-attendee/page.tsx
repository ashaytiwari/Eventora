import { UserRole } from "@/lib/constants";

import AuthGuard from "../auth/AuthGuard";

export default function Page() {

  return (
    <AuthGuard allowedRoles={[UserRole.EVENT_ATTENDEE]}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h3>Event Attendee Home Page</h3>
      </div>
    </AuthGuard>
  );

}