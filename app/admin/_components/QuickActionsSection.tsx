import Link from "next/link";
import {
  Calendar,
  Users,
  Building2,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const quickActions = [
  {
    title: "Manage System Events",
    description: "Moderate events, inspect submissions, and control publication statuses.",
    icon: Calendar,
    href: "/admin/events",
    buttonText: "Open Events",
    tag: "Event Hub",
  },
  {
    title: "User Management",
    description: "Review attendees, monitor account activity, and adjust suspension states.",
    icon: Users,
    href: "/admin/users",
    buttonText: "View Users",
    tag: "Access Control",
  },
  {
    title: "Onboard Event Organizer",
    description: "Invite and set up organizations to publish and host tech gatherings.",
    icon: Building2,
    href: "/admin/users",
    buttonText: "Onboard Organizer",
    tag: "Partner Onboarding",
  },
];

const QuickActionsSection = () => {

  const containerAttributes = {
    className: "flex flex-col gap-4 w-full",
  };

  const gridAttributes = {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full",
  };

  function renderHeader() {

    return (
      <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
        <Sparkles className="w-3.5 h-3.5" />

        <span>Quick Operations & Direct Access</span>
      </div>
    );

  }

  function renderActionCard(action: (typeof quickActions)[0]) {

    const Icon = action.icon;

    const cardLinkAttributes = {
      href: action.href,
      className:
        "group flex flex-col justify-between p-6 rounded-2xl bg-dark-100/70 backdrop-blur-xl border border-border-dark card-shadow transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:bg-dark-100/90",
    };

    return (
      <Link key={action.title} {...cardLinkAttributes}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-mono text-light-200 uppercase bg-dark-200/80 px-2.5 py-1 rounded-full border border-white/5">
              {action.tag}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-base font-semibold text-white group-hover:text-primary transition-colors">
              {action.title}
            </h4>

            <p className="text-xs text-light-200 leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary/90">
          <span>{action.buttonText}</span>

          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </Link>
    );

  }

  return (
    <div {...containerAttributes}>

      {renderHeader()}

      <div {...gridAttributes}>

        {quickActions.map((action) => renderActionCard(action))}

      </div>

    </div>
  );

};

export default QuickActionsSection;
