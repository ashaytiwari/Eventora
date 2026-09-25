'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import UsersNavbar from "@/components/navbar/UsersNavbar";

import { UserRole } from "@/lib/constants";

const Navbar = () => {

  const pathname = usePathname();

  const { data: session }: any = useSession();
  const userRole = session?.user?.role as UserRole;

  if (pathname === '/auth/signin' || pathname === '/auth/signup') {
    return null;
  }

  if (userRole) {
    return <UsersNavbar />;
  }

  const logoLinkAttributes = {
    href: "/",
    className: "logo",
  };

  const logoImageAttributes = {
    src: "/images/app_logo.png",
    alt: "logo",
    width: 30,
    height: 30,
  };

  function renderNavbarContent() {

    const signInLinkAttributes = {
      href: "/auth/signin",
      className: "text-xs sm:text-sm font-medium text-light-100 hover:text-primary transition-colors",
    };

    const signUpLinkAttributes = {
      href: "/auth/signup",
      className: "text-xs font-semibold px-4 py-2 rounded-full bg-primary text-black hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(93,254,202,0.2)] hover:scale-105",
    };

    return (
      <ul className="flex items-center gap-4 sm:gap-6 list-none">

        <Link {...signInLinkAttributes}>
          Sign In
        </Link>

        <Link {...signUpLinkAttributes}>
          Get Started
        </Link>

      </ul>
    );

  }

  return (
    <header>
      <nav>
        <Link {...logoLinkAttributes}>
          <Image {...logoImageAttributes} />
          <p>Eventora</p>
        </Link>

        {renderNavbarContent()}

      </nav>
    </header>
  );

};

export default Navbar;