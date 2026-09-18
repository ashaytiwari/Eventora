'use client';

import {
  Calendar,
  Users,
  Building2,
  UserCheck,
  Ban,
  Clock,
  RefreshCw,
  Shield,
  Sparkles,
  AlertCircle,
  Activity,
} from "lucide-react";

import ProtectedRouteAuthGuard from "@/components/authGuards/ProtectedRouteAuthGuard";
import { UserRole } from "@/lib/constants";

import MetricCard, { MetricColorVariant } from "./_components/MetricCard";
import QuickActionsSection from "./_components/QuickActionsSection";
import { useAdminMetrics } from "./_components/service";

const AdminDashboardPage = () => {

  const { data: metrics, isLoading, isError, isFetching, refetch } = useAdminMetrics();

  const containerAttributes = {
    className: "flex-1 flex flex-col w-full pb-16 gap-10",
  };

  const refreshButtonAttributes = {
    type: "button" as const,
    onClick: () => refetch(),
    disabled: isFetching,
    className:
      "inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-xl bg-dark-100/80 border border-border-dark text-light-100 hover:text-white hover:border-primary/40 transition-colors card-shadow cursor-pointer disabled:opacity-60",
    "aria-label": "Refresh metrics",
  };

  const userMetricsGridAttributes = {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full",
  };

  const eventMetricsGridAttributes = {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-6 w-full",
  };

  function renderPageHeader() {

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />

            <Sparkles className="w-3.5 h-3.5" />

            <span>Super Admin Dashboard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Platform Metrics
          </h1>

          <p className="text-light-200 text-sm max-w-xl">
            Real-time analytics and activity telemetry across Eventora. Track user registrations, organizer cohorts, and event schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button {...refreshButtonAttributes}>
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />

            <span>{isFetching ? "Syncing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>
    );

  }

  function renderErrorState() {

    return (
      <div className="py-16 px-6 rounded-2xl bg-dark-100/50 border border-border-dark flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="text-base font-semibold text-white">
            Failed to load dashboard metrics
          </h4>

          <p className="text-xs text-light-200">
            Could not fetch telemetry data from the server. Please try again.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );

  }

  function renderUserMetricsSection() {

    const userMetricsConfig: {
      title: string;
      value: number | undefined;
      description: string;
      icon: typeof Users;
      href: string;
      colorVariant: MetricColorVariant;
      badgeText: string;
    }[] = [
      {
        title: "Total Platform Users",
        value: metrics?.totalUsers,
        description: "Registered community members across Eventora",
        icon: Users,
        href: "/admin/users",
        colorVariant: "primary",
        badgeText: "All Users",
      },
      {
        title: "Event Organizers",
        value: metrics?.eventOrganizers,
        description: "Verified organizations hosting gatherings",
        icon: Building2,
        href: "/admin/users?role=event_organizer",
        colorVariant: "emerald",
        badgeText: "Hosts",
      },
      {
        title: "Event Attendees",
        value: metrics?.eventAttendees,
        description: "Active participants attending tech sessions",
        icon: UserCheck,
        href: "/admin/users?role=event_attendee",
        colorVariant: "blue",
        badgeText: "Attendees",
      },
      {
        title: "Suspended Accounts",
        value: metrics?.suspendedUsers,
        description: "Restricted accounts pending moderation",
        icon: Ban,
        href: "/admin/users?status=suspended",
        colorVariant: "rose",
        badgeText: "Moderation",
      },
    ];

    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
            <Activity className="w-3.5 h-3.5" />

            <span>User Ecosystem Telemetry</span>
          </div>

          <span className="text-xs font-mono text-light-200">
            {metrics ? `${metrics.totalUsers} Total Accounts` : ""}
          </span>
        </div>

        <div {...userMetricsGridAttributes}>
          {userMetricsConfig.map((item) => (
            <MetricCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              href={item.href}
              colorVariant={item.colorVariant}
              badgeText={item.badgeText}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    );

  }

  function renderEventMetricsSection() {

    const eventMetricsConfig: {
      title: string;
      value: number | undefined;
      description: string;
      icon: typeof Calendar;
      href: string;
      colorVariant: MetricColorVariant;
      badgeText: string;
    }[] = [
      {
        title: "Total System Events",
        value: metrics?.totalEvents,
        description: "All virtual and in-person events published on the platform",
        icon: Calendar,
        href: "/admin/events",
        colorVariant: "purple",
        badgeText: "All Events",
      },
      {
        title: "Upcoming Scheduled Events",
        value: metrics?.upcomingEvents,
        description: "Future tech gatherings and conferences queued up",
        icon: Clock,
        href: "/admin/events",
        colorVariant: "amber",
        badgeText: "Upcoming",
      },
    ];

    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
            <Calendar className="w-3.5 h-3.5" />

            <span>Events & Schedule Insights</span>
          </div>

          <span className="text-xs font-mono text-light-200">
            {metrics ? `${metrics.totalEvents} Events Created` : ""}
          </span>
        </div>

        <div {...eventMetricsGridAttributes}>
          {eventMetricsConfig.map((item) => (
            <MetricCard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              icon={item.icon}
              href={item.href}
              colorVariant={item.colorVariant}
              badgeText={item.badgeText}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    );

  }

  function renderQuickActions() {

    return (
      <QuickActionsSection />
    );

  }

  return (
    <ProtectedRouteAuthGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
      <div {...containerAttributes}>

        {renderPageHeader()}

        {isError && renderErrorState()}

        {!isError && (
          <>
            {renderUserMetricsSection()}

            {renderEventMetricsSection()}

            {renderQuickActions()}
          </>
        )}

      </div>
    </ProtectedRouteAuthGuard>
  );

};

export default AdminDashboardPage;