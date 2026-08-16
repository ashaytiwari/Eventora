import { signOut } from 'next-auth/react';

let isSigningOut = false;

export async function handleUnauthorized() {

  // Prevent multiple simultaneous 401s from triggering
  // multiple signOut calls.
  if (isSigningOut) {
    return;
  }

  isSigningOut = true;

  try {
    await signOut({
      callbackUrl: '/auth/signin',
    });
  } finally {
    isSigningOut = false;
  }
}