import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

export default function Page() {

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h3>Super Admin Home Page</h3>
      </div>
    </ProtectedRouteAuthGuard>
  );

}