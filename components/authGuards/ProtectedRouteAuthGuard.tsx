'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { UserRole } from '@/lib/constants';

import Loader from '../../app/loading';

interface ProtectedRouteAuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRouteAuthGuard({
  children,
  allowedRoles = [],
}: ProtectedRouteAuthGuardProps) {

  const router = useRouter();

  const { status, data: session }: any = useSession();

  useEffect(() => {

    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
      return;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(session?.user?.role as UserRole)
    ) {
      router.replace('/auth/unauthorized');
    }

  }, [status, session, allowedRoles, router]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(session?.user.role as UserRole)
  ) {
    return null;
  }

  return <>{children}</>;

}