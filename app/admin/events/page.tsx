'use client';

import { useState } from "react";
import { Calendar, Shield, Sparkles } from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

import AdminEventDetailsModal from "./_components/AdminEventDetailsModal";
import AdminEventFilters from "./_components/AdminEventFilters";
import AdminEventsPagination from "./_components/AdminEventsPagination";
import AdminEventsTable from "./_components/AdminEventsTable";
import { useAdminEvents } from "./_components/service";
import { EventFilterStatus, IEventListItem } from "./_components/types";

const AdminEventsPage = () => {

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<EventFilterStatus>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState<IEventListItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useAdminEvents({
    status: selectedStatus,
    searchText,
    page,
    limit,
  });

  const events = data?.events || [];
  const pagination = data?.pagination || {
    page,
    limit,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const isFiltered = searchText.trim().length > 0 || selectedStatus !== "ALL";

  function handleSearchTextChange(value: string) {

    setSearchText(value);
    setPage(1);

  }

  function handleStatusChange(status: EventFilterStatus) {

    setSelectedStatus(status);
    setPage(1);

  }

  function handleResetFilters() {

    setSearchText("");
    setSelectedStatus("ALL");
    setPage(1);

  }

  function handleLimitChange(newLimit: number) {

    setLimit(newLimit);
    setPage(1);

  }

  function handleViewDetails(event: IEventListItem) {

    setSelectedEvent(event);
    setIsDetailsModalOpen(true);

  }

  function handleCloseModal() {

    setIsDetailsModalOpen(false);
    setSelectedEvent(null);

  }

  // If the active event was updated in the list, keep the modal's event reference in sync
  const currentActiveEvent = selectedEvent
    ? events.find((e) => e._id === selectedEvent._id) || selectedEvent
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
    selectedStatus,
    onStatusChange: handleStatusChange,
    onResetFilters: handleResetFilters,
    totalCount: pagination.total,
  };

  const tableAttributes = {
    events,
    isLoading,
    isError,
    onRetry: () => refetch(),
    isFiltered,
    onResetFilters: handleResetFilters,
    onViewDetails: handleViewDetails,
  };

  const paginationAttributes = {
    pagination,
    onPageChange: setPage,
    onLimitChange: handleLimitChange,
  };

  const modalAttributes = {
    event: currentActiveEvent,
    isOpen: isDetailsModalOpen,
    onClose: handleCloseModal,
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
            System Events
          </h1>

          <p className="text-light-200 text-sm max-w-xl">
            Monitor, moderate, and manage all events created across Eventora.
            Inspect full event submissions and control status visibility.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-dark-100/80 border border-border-dark px-4 py-2.5 rounded-xl card-shadow">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-light-200 uppercase">
              Total Events
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
        <AdminEventFilters {...filtersAttributes} />
      </aside>
    );

  }

  function renderRightSection() {

    return (
      <section {...rightColumnAttributes}>

        <AdminEventsTable {...tableAttributes} />

        {events.length > 0 && (
          <AdminEventsPagination {...paginationAttributes} />
        )}

      </section>
    );

  }

  function renderDetailsModal() {

    return (
      <AdminEventDetailsModal {...modalAttributes} />
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

        {renderDetailsModal()}

      </div>
    </ProtectedRouteAuthGuard>
  );

};

export default AdminEventsPage;
