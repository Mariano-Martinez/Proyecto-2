'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { consumeRedirectPath, getAuth, setRedirectPath } from './storage';

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authed = getAuth();
    if (!authed) {
      setRedirectPath(pathname);
      router.replace(`/auth?next=${encodeURIComponent(pathname)}`);
    } else {
      setReady(true);
    }
  }, [pathname, router]);

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
