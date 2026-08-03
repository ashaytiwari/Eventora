'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { UserRole } from '@/lib/constants';

import Loader from '../loading';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthGuard({
  children,
  allowedRoles = [],
}: AuthGuardProps) {

  const router = useRouter();

  const { status, data: session }: any = useSession();

  console.log(status, session);

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