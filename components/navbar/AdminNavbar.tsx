'use client';

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Calendar, Users, ShieldCheck } from "lucide-react";

import { UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils/common";

const AdminNavbar = () => {

  const pathname = usePathname();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: session }: any = useSession();
  const user = session?.user;
  const userName = user?.name || "Super Admin";
  const userEmail = user?.email || "admin@eventora.com";
  const userImage = user?.image;
  const userRole = (user?.role as UserRole) || UserRole.SUPER_ADMIN;

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }

    }

    function handleKeyDown(event: KeyboardEvent) {

      if (event.key === "Escape") {
        setIsPopoverOpen(false);
      }

    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, []);

  const navLinks = [
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
      isActive: pathname === "/admin/events" || pathname === "/admin",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      isActive: pathname === "/admin/users",
    },
  ];

  const logoLinkAttributes = {
    href: "/admin",
    className: "logo flex flex-row items-center gap-2 transition-opacity hover:opacity-90",
  };

  const logoImageAttributes = {
    src: "/images/app_logo.png",
    alt: "Eventora Logo",
    width: 30,
    height: 30,
    priority: true,
  };

  const avatarButtonAttributes = {
    type: "button" as const,
    onClick: () => setIsPopoverOpen((prev) => !prev),
    className: cn(
      "flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition-all duration-200 cursor-pointer focus:outline-none",
      isPopoverOpen
        ? "border-primary bg-dark-100 shadow-[0_0_15px_rgba(93,254,202,0.2)]"
        : "border-border-dark bg-dark-200/60 hover:border-gray-600 hover:bg-dark-100"
    ),
    "aria-expanded": isPopoverOpen,
    "aria-haspopup": "true" as const,
    "aria-label": "User menu",
  };

  const logoutButtonAttributes = {
    type: "button" as const,
    onClick: () => signOut({ callbackUrl: "/auth/signin" }),
    className: "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors duration-150 cursor-pointer",
  };

  function renderLogo() {

    return (
      <Link {...logoLinkAttributes}>
        <Image {...logoImageAttributes} />

        <p className="text-xl font-bold italic max-sm:hidden text-white">Eventora</p>
      </Link>
    );

  }

  function renderNavLinks() {

    return (
      <div className="flex items-center gap-2">
        {navLinks.map((link) => {

          const Icon = link.icon;

          const linkAttributes = {
            key: link.name,
            href: link.href,
            className: cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              link.isActive
                ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(93,254,202,0.15)]"
                : "text-light-200 hover:text-white hover:bg-dark-100 border border-transparent"
            ),
          };

          return (
            <Link {...linkAttributes}>
              <Icon className="w-4 h-4" />

              <span>{link.name}</span>
            </Link>
          );

        })}
      </div>
    );

  }

  function renderAvatarButton() {

    const initial = userName.charAt(0).toUpperCase();

    return (
      <button {...avatarButtonAttributes}>
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="hidden md:flex flex-col items-start text-left leading-tight">
          <span className="text-xs font-semibold text-white max-w-[100px] truncate">{userName}</span>

          <span className="text-[10px] text-light-200 uppercase tracking-wider font-mono">{userRole}</span>
        </div>
      </button>
    );

  }

  function renderAvatarPopover() {

    if (!isPopoverOpen) {
      return null;
    }

    return (
      <div className="absolute right-0 mt-3 w-64 rounded-xl bg-dark-100/95 backdrop-blur-xl border border-border-dark card-shadow p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-dark-200/50 mb-2 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>

            <p className="text-xs text-light-200 truncate">{userEmail}</p>

            <div className="flex items-center gap-1 mt-1 text-[10px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-full w-fit border border-primary/20">
              <ShieldCheck className="w-3 h-3" />

              <span>Super Admin</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border-dark my-1" />

        <div className="pt-1">
          <button {...logoutButtonAttributes}>
            <LogOut className="w-4 h-4" />

            <span>Log out</span>
          </button>
        </div>
      </div>
    );

  }

  return (
    <header className="glass sticky top-0 z-50">
      <nav className="flex flex-row items-center justify-between mx-auto container sm:px-10 px-5 py-4">

        {renderLogo()}

        <div className="flex items-center gap-4 sm:gap-6">

          {renderNavLinks()}

          <div ref={popoverRef} className="relative">

            {renderAvatarButton()}

            {renderAvatarPopover()}

          </div>

        </div>

      </nav>
    </header>
  );

};

export default AdminNavbar;
