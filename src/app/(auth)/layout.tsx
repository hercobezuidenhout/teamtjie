import { PropsWithChildren } from 'react';
import { AuthProviders } from '@/app/(auth)/providers';

const AuthLayout = ({ children }: PropsWithChildren) => {

  return (
    <AuthProviders>
      {children}
    </AuthProviders>
  )
}

export default AuthLayout;