'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Shield, Sparkles } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

import AddOrganizerModal from "./_components/AddOrganizerModal";
import AdminUserFilters from "./_components/AdminUserFilters";
import AdminUsersPagination from "./_components/AdminUsersPagination";
import AdminUsersTable from "./_components/AdminUsersTable";
import EditOrganizerModal from "./_components/EditOrganizerModal";
import { useAdminUsers } from "./_components/service";
import { IUserListItem, UserFilterRole, UserFilterStatus } from "./_components/types";

const AdminUsersPage = () => {

  const searchParams = useSearchParams();
  const roleParam = (searchParams.get("role") as UserFilterRole) || "ALL";
  const statusParam = (searchParams.get("status") as UserFilterStatus) || "ALL";

  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserFilterRole>(roleParam);
  const [selectedStatus, setSelectedStatus] = useState<UserFilterStatus>(statusParam);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<IUserListItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {

    if (roleParam && roleParam !== selectedRole) {
      setSelectedRole(roleParam);
    }

    if (statusParam && statusParam !== selectedStatus) {
      setSelectedStatus(statusParam);
    }

  }, [roleParam, statusParam]);


  const { data, isLoading, isError, refetch } = useAdminUsers({
    role: selectedRole,
    status: selectedStatus,
    searchText,
    page,
    limit,
  });

  const users = data?.users || [];
  const pagination = data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const isFiltered =
    searchText.trim().length > 0 || selectedRole !== "ALL" || selectedStatus !== "ALL";

  function handleSearchTextChange(value: string) {

    setSearchText(value);
    setPage(1);

  }

  function handleRoleChange(role: UserFilterRole) {

    setSelectedRole(role);
    setPage(1);

  }

  function handleStatusChange(status: UserFilterStatus) {

    setSelectedStatus(status);
    setPage(1);

  }

  function handleResetFilters() {

    setSearchText("");
    setSelectedRole("ALL");
    setSelectedStatus("ALL");
    setPage(1);

  }

  function handleLimitChange(newLimit: number) {

    setLimit(newLimit);
    setPage(1);

  }

  function handleOpenAddModal() {

    setIsAddModalOpen(true);

  }

  function handleCloseAddModal() {

    setIsAddModalOpen(false);

  }

  function handleEditOrganizer(user: IUserListItem) {

    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);

  }

  function handleCloseEditModal() {

    setIsEditModalOpen(false);
    setSelectedUserForEdit(null);

  }

  // Keep the active user reference up to date if refetched
  const currentActiveUserForEdit = selectedUserForEdit
    ? users.find((u) => u._id === selectedUserForEdit._id) || selectedUserForEdit
    : null;

  const containerAttributes = {
    className: "flex-1 flex flex-col w-full pb-16",
  };

  const mainGridAttributes = {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full",
  };

  const leftColumnAttributes = {
    className: "lg:col-span-4 xl:col-span-4 w-full",
  };

  const rightColumnAttributes = {
    className:
      "lg:col-span-8 xl:col-span-8 w-full bg-dark-100/70 backdrop-blur-xl border border-border-dark rounded-2xl card-shadow overflow-hidden flex flex-col",
  };

  const filtersAttributes = {
    searchText,
    onSearchTextChange: handleSearchTextChange,
    selectedRole,
    onRoleChange: handleRoleChange,
    selectedStatus,
    onStatusChange: handleStatusChange,
    onResetFilters: handleResetFilters,
    onOpenAddModal: handleOpenAddModal,
    totalCount: pagination.total,
  };

  const tableAttributes = {
    users,
    isLoading,
    isError,
    onRetry: () => refetch(),
    isFiltered,
    onResetFilters: handleResetFilters,
    onEditOrganizer: handleEditOrganizer,
    onOpenAddOrganizerModal: handleOpenAddModal,
  };

  const paginationAttributes = {
    pagination,
    onPageChange: setPage,
    onLimitChange: handleLimitChange,
  };

  const addModalAttributes = {
    isOpen: isAddModalOpen,
    onClose: handleCloseAddModal,
  };

  const editModalAttributes = {
    user: currentActiveUserForEdit,
    isOpen: isEditModalOpen,
    onClose: handleCloseEditModal,
  };

  function renderPageHeader() {

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />

            <Sparkles className="w-3.5 h-3.5" />

            <span>Super Admin Dashboard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Users & Organizers
          </h1>

          <p className="text-light-200 text-sm max-w-xl">
            Manage all registered platform users, onboard new event organizers, and moderate account statuses across Eventora.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-dark-100/80 border border-border-dark px-4 py-2.5 rounded-xl card-shadow">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-light-200 uppercase">
              Total Users
            </span>

            <span className="text-lg font-bold font-mono text-white">
              {pagination.total}
            </span>
          </div>
        </div>
      </div>
    );

  }

  function renderLeftSection() {

    return (
      <aside {...leftColumnAttributes}>
        <AdminUserFilters {...filtersAttributes} />
      </aside>
    );

  }

  function renderRightSection() {

    return (
      <section {...rightColumnAttributes}>

        <AdminUsersTable {...tableAttributes} />

        {users.length > 0 && (
          <AdminUsersPagination {...paginationAttributes} />
        )}

      </section>
    );

  }

  function renderAddModal() {

    return (
      <AddOrganizerModal {...addModalAttributes} />
    );

  }

  function renderEditModal() {

    return (
      <EditOrganizerModal {...editModalAttributes} />
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div {...containerAttributes}>

        {renderPageHeader()}

        <div {...mainGridAttributes}>

          {renderLeftSection()}

          {renderRightSection()}

        </div>

        {renderAddModal()}

        {renderEditModal()}

      </div>
    </ProtectedRouteAuthGuard>
  );

};

export default AdminUsersPage;
