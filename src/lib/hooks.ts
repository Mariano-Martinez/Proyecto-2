'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { consumeRedirectPath, getAuth, setRedirectPath } from './storage';

export const useAuthGuard = (options?: { allowGuest?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const allowGuest = options?.allowGuest ?? false;

  useEffect(() => {
    const authed = getAuth();
    if (!authed && !allowGuest) {
      setRedirectPath(pathname);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else {
      setReady(true);
    }
  }, [allowGuest, pathname, router]);

  return ready;
};

export const useRedirectAfterAuth = () => {
  const router = useRouter();
  const search = useSearchParams();
  useEffect(() => {
    const stored = consumeRedirectPath();
    const next = search.get('next') || stored || '/dashboard';
    router.replace(next);
  }, [router, search]);
};

export const useAuthStatus = () => {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(getAuth());
  }, []);

  return isAuthed;
};
