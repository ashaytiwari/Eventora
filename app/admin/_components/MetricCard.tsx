import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/common";

export type MetricColorVariant =
  | "primary"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "purple";

interface MetricCardProps {
  title: string;
  value: number | undefined;
  description: string;
  icon: LucideIcon;
  href: string;
  colorVariant?: MetricColorVariant;
  badgeText?: string;
  isLoading?: boolean;
}

const variantStyles: Record<
  MetricColorVariant,
  {
    iconBg: string;
    iconBorder: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    glowColor: string;
    hoverBorder: string;
  }
> = {
  primary: {
    iconBg: "bg-primary/10",
    iconBorder: "border-primary/20",
    iconText: "text-primary",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    badgeBorder: "border-primary/20",
    glowColor: "rgba(93,254,202,0.15)",
    hoverBorder: "hover:border-primary/40",
  },
  blue: {
    iconBg: "bg-blue/10",
    iconBorder: "border-blue/20",
    iconText: "text-blue",
    badgeBg: "bg-blue/10",
    badgeText: "text-blue",
    badgeBorder: "border-blue/20",
    glowColor: "rgba(148,234,255,0.15)",
    hoverBorder: "hover:border-blue/40",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconText: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    glowColor: "rgba(16,185,129,0.15)",
    hoverBorder: "hover:border-emerald-500/40",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    iconText: "text-amber-300",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/20",
    glowColor: "rgba(245,158,11,0.15)",
    hoverBorder: "hover:border-amber-500/40",
  },
  rose: {
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    iconText: "text-rose-400",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-400",
    badgeBorder: "border-rose-500/20",
    glowColor: "rgba(244,63,94,0.15)",
    hoverBorder: "hover:border-rose-500/40",
  },
  purple: {
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    iconText: "text-purple-400",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    badgeBorder: "border-purple-500/20",
    glowColor: "rgba(168,85,247,0.15)",
    hoverBorder: "hover:border-purple-500/40",
  },
};

const MetricCard = ({
  title,
  value = 0,
  description,
  icon: Icon,
  href,
  colorVariant = "primary",
  badgeText,
  isLoading = false,
}: MetricCardProps) => {

  const style = variantStyles[colorVariant] || variantStyles.primary;

  const cardLinkAttributes = {
    href,
    className: cn(
      "group relative flex flex-col justify-between p-6 rounded-2xl bg-dark-100/70 backdrop-blur-xl border border-border-dark card-shadow",
      "transition-all duration-300 hover:-translate-y-1 hover:bg-dark-100/90",
      style.hoverBorder
    ),
  };

  const iconContainerAttributes = {
    className: cn(
      "w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110",
      style.iconBg,
      style.iconBorder,
      style.iconText
    ),
  };

  const badgeAttributes = {
    className: cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border",
      style.badgeBg,
      style.badgeBorder,
      style.badgeText
    ),
  };

  function renderCardHeader() {

    return (
      <div className="flex items-start justify-between gap-3 mb-4">
        <div {...iconContainerAttributes}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2">
          {badgeText && (
            <span {...badgeAttributes}>
              {badgeText}
            </span>
          )}

          <div className="w-8 h-8 rounded-lg bg-dark-200/60 border border-white/5 flex items-center justify-center text-light-200 group-hover:text-white group-hover:bg-dark-200 group-hover:border-white/20 transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    );

  }

  function renderCardValue() {

    if (isLoading) {
      return (
        <div className="my-2">
          <div className="h-10 w-24 bg-dark-200/80 rounded-lg animate-pulse" />
        </div>
      );
    }

    return (
      <div className="my-2">
        <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white group-hover:text-white transition-colors">
          {value.toLocaleString()}
        </span>
      </div>
    );

  }

  function renderCardFooter() {

    return (
      <div className="flex flex-col gap-1 mt-2 pt-3 border-t border-white/5">
        <span className="text-sm font-semibold text-light-100 group-hover:text-primary transition-colors">
          {title}
        </span>

        <p className="text-xs text-light-200 line-clamp-1">
          {description}
        </p>
      </div>
    );

  }

  return (
    <Link {...cardLinkAttributes}>
      <div>

        {renderCardHeader()}

        {renderCardValue()}

      </div>

      {renderCardFooter()}
    </Link>
  );

};

export default MetricCard;
