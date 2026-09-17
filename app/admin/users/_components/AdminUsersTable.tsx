import {
  Calendar,
  Building2,
  Mail,
  AlertCircle,
  Inbox,
  Edit,
  Plus,
} from "lucide-react";

import { UserRole } from "@/lib/constants";

import UserRoleBadge from "./UserRoleBadge";
import UserStatusSelector from "./UserStatusSelector";
import { IUserListItem } from "./types";

interface AdminUsersTableProps {
  users: IUserListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  onEditOrganizer: (user: IUserListItem) => void;
  onOpenAddOrganizerModal: () => void;
}

const AdminUsersTable = ({
  users,
  isLoading,
  isError,
  onRetry,
  isFiltered,
  onResetFilters,
  onEditOrganizer,
  onOpenAddOrganizerModal,
}: AdminUsersTableProps) => {

  const tableContainerAttributes = {
    className:
      "w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
  };

  const tableAttributes = {
    className: "w-full text-left border-collapse min-w-[760px]",
  };

  const retryButtonAttributes = {
    type: "button" as const,
    onClick: onRetry,
    className:
      "px-4 py-2 text-xs font-semibold rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 transition-colors cursor-pointer",
  };

  const clearFiltersButtonAttributes = {
    type: "button" as const,
    onClick: onResetFilters,
    className:
      "px-4 py-2 text-xs font-semibold rounded-lg bg-dark-200 text-light-100 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer",
  };

  const addOrganizerButtonAttributes = {
    type: "button" as const,
    onClick: onOpenAddOrganizerModal,
    className:
      "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors shadow-[0_0_12px_rgba(93,254,202,0.3)] cursor-pointer",
  };

  function getInitials(firstname?: string, lastname?: string) {

    const first = firstname ? firstname.charAt(0).toUpperCase() : "";
    const last = lastname ? lastname.charAt(0).toUpperCase() : "";
    return `${first}${last}` || "U";

  }

  function formatJoinDate(dateStr: string) {

    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  }

  function renderTableHeader() {

    return (
      <thead>
        <tr className="border-b border-border-dark bg-dark-200/40 text-xs font-mono uppercase tracking-wider text-light-200">
          <th className="py-3.5 px-5 font-semibold">User Details</th>

          <th className="py-3.5 px-4 font-semibold">Role</th>

          <th className="py-3.5 px-4 font-semibold">Account Status</th>

          <th className="py-3.5 px-4 font-semibold">Joined Date</th>

          <th className="py-3.5 px-5 text-right font-semibold">Action</th>
        </tr>
      </thead>
    );

  }

  function renderUserRow(user: IUserListItem) {

    const isOrganizer = user.role === UserRole.EVENT_ORGANIZER;
    const fullName = `${user.firstname || ""} ${user.lastname || ""}`.trim() || "User";

    const rowAttributes = {
      className:
        "border-b border-white/5 hover:bg-dark-200/30 transition-colors duration-150 group",
    };

    const editButtonAttributes = {
      type: "button" as const,
      onClick: () => onEditOrganizer(user),
      className:
        "inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/90 transition-colors py-1.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 font-medium cursor-pointer",
    };

    return (
      <tr key={user._id} {...rowAttributes}>
        <td className="py-4 px-5">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-dark-200 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-primary shrink-0 shadow-inner">
              {getInitials(user.firstname, user.lastname)}
            </div>

            <div className="flex flex-col gap-1 max-w-[240px]">
              <span className="font-semibold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {fullName}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-light-200/70 truncate">
                <Mail className="w-3 h-3 shrink-0" />

                <span className="truncate">{user.email}</span>
              </div>

              {isOrganizer && user.organization?.organizationName && (
                <div className="inline-flex items-center gap-1 text-[11px] text-light-200 bg-dark-200/90 border border-white/5 px-2 py-0.5 rounded-md w-fit mt-0.5">
                  <Building2 className="w-3 h-3 text-primary shrink-0" />

                  <span className="truncate max-w-[180px]">
                    {user.organization.organizationName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </td>

        <td className="py-4 px-4">
          <UserRoleBadge role={user.role} />
        </td>

        <td className="py-4 px-4">
          <UserStatusSelector
            userId={user._id}
            currentStatus={user.status}
          />
        </td>

        <td className="py-4 px-4 text-xs text-light-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />

            <span className="font-mono text-light-100">
              {formatJoinDate(user.createdAt)}
            </span>
          </div>
        </td>

        <td className="py-4 px-5 text-right">
          {isOrganizer ? (
            <button {...editButtonAttributes}>
              <Edit className="w-3.5 h-3.5" />

              <span>Edit Organizer</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-light-200/40">
              Attendee
            </span>
          )}
        </td>
      </tr>
    );

  }

  function renderLoadingSkeleton() {

    return (
      <tbody>
        {[1, 2, 3, 4, 5].map((item) => (
          <tr key={item} className="border-b border-white/5 animate-pulse">
            <td className="py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-200/80 shrink-0" />

                <div className="flex flex-col gap-2 w-48">
                  <div className="h-4 bg-dark-200/80 rounded w-full" />

                  <div className="h-3 bg-dark-200/40 rounded w-2/3" />
                </div>
              </div>
            </td>

            <td className="py-4 px-4">
              <div className="h-6 bg-dark-200/60 rounded-full w-24" />
            </td>

            <td className="py-4 px-4">
              <div className="h-7 bg-dark-200/60 rounded-full w-24" />
            </td>

            <td className="py-4 px-4">
              <div className="h-3.5 bg-dark-200/60 rounded w-24" />
            </td>

            <td className="py-4 px-5 text-right">
              <div className="h-7 bg-dark-200/40 rounded-lg w-24 ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    );

  }

  function renderErrorState() {

    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="text-base font-semibold text-white">
            Failed to load users
          </h4>

          <p className="text-xs text-light-200">
            There was an issue fetching users from the server. Please try again.
          </p>
        </div>

        <button {...retryButtonAttributes}>
          Try Again
        </button>
      </div>
    );

  }

  function renderEmptyState() {

    return (
      <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-dark-200/60 border border-white/10 flex items-center justify-center text-light-200/60">
          <Inbox className="w-7 h-7" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="text-base font-semibold text-white">
            {isFiltered ? "No matching users found" : "No users registered yet"}
          </h4>

          <p className="text-xs text-light-200">
            {isFiltered
              ? "Try adjusting your search keywords, role, or status filters."
              : "Onboard new event organizers to begin hosting events on Eventora."}
          </p>
        </div>

        {isFiltered ? (
          <button {...clearFiltersButtonAttributes}>
            Clear Filters
          </button>
        ) : (
          <button {...addOrganizerButtonAttributes}>
            <Plus className="w-4 h-4" />

            <span>Add Event Organizer</span>
          </button>
        )}
      </div>
    );

  }

  function renderTableContent() {

    if (isLoading) {
      return renderLoadingSkeleton();
    }

    if (users.length === 0) {
      return null;
    }

    return <tbody>{users.map((user) => renderUserRow(user))}</tbody>;

  }

  if (isError) {
    return renderErrorState();
  }

  return (
    <div className="w-full">
      <div {...tableContainerAttributes}>
        <table {...tableAttributes}>

          {renderTableHeader()}

          {renderTableContent()}

        </table>
      </div>

      {!isLoading && users.length === 0 && renderEmptyState()}
    </div>
  );

};

export default AdminUsersTable;
