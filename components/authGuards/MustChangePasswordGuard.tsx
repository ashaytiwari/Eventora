'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Loader from '@/app/loading';
import { useUserProfile } from '@/app/service';

interface MustChangePasswordGuardProps {
  children: ReactNode;
}

export default function MustChangePasswordGuard({
  children,
}: MustChangePasswordGuardProps) {

  const router = useRouter();
  const pathname = usePathname();

  const { status, data: session }: any = useSession();
  const userId = session?.user?.id;

  const { data: userProfile, isLoading } = useUserProfile(userId);

  const isAuthenticated = status === 'authenticated' && Boolean(userId);
  const isChangePasswordPage = pathname === '/auth/change-password';
  const mustChangePassword = isAuthenticated && userProfile?.mustChangePassword === true;

  useEffect(() => {

    if (mustChangePassword && !isChangePasswordPage) {
      router.replace('/auth/change-password');
    }

  }, [mustChangePassword, isChangePasswordPage, router]);

  function renderLoader() {

    return (
      <Loader />
    );

  }

  if (isAuthenticated && isLoading) {
    return renderLoader();
  }

  if (mustChangePassword && !isChangePasswordPage) {
    return renderLoader();
  }

  return <>{children}</>;

}
