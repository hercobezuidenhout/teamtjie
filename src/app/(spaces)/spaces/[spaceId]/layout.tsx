import { cookies } from 'next/headers';
import { PropsWithChildren } from 'react';

interface LayoutProps extends PropsWithChildren {
  params: { spaceId: string; };
}

/**
 * Layout for space pages that tracks the last visited space
 * This enables direct redirect from root (/) to the last visited space
 * eliminating the double redirect: / → /spaces → /spaces/{id}
 */
const SpaceLayout = async ({ children, params }: LayoutProps) => {
  // Store last visited space in cookie for fast redirect
  cookies().set('last-space-id', params.spaceId, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return <>{children}</>;
};

export default SpaceLayout;
