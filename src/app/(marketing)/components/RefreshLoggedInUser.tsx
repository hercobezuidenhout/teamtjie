'use client';

import { useSession } from '@supabase/auth-helpers-react';
import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const RefreshLoggedInUser: FC = () => {
  const session = useSession();
  const { refresh } = useRouter();

  useEffect(() => {
    if (session) {
      refresh();
    }
  }, [refresh, session]);

  return null;
};
