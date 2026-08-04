import { UserRole } from "@/lib/constants";

import AuthGuard from "../AuthGuard";

export default function Page() {

  return (
    <AuthGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h3>Super Admin Home Page</h3>
      </div>
    </AuthGuard>
  );

}