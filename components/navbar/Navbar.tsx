'use client';

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import AdminNavbar from "@/components/navbar/AdminNavbar";

import { UserRole } from "@/lib/constants";

const Navbar = () => {

  const pathname = usePathname();

  const { data: session }: any = useSession();
  const userRole = session?.user?.role as UserRole;

  if (pathname === '/auth/signin' || pathname === '/auth/signup') {
    return null;
  }

  if (pathname.startsWith('/admin') || userRole === UserRole.SUPER_ADMIN) {
    return <AdminNavbar />;
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

    return (
      <ul>
        <Link href="/">Home</Link>
        <Link href="/auth/signup">Sign Up</Link>
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