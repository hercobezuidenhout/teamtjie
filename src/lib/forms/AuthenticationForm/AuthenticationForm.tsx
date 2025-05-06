'use client';

import { BoxProps, Link, useBoolean, VStack } from '@chakra-ui/react';
import { LoginForm } from '../LoginForm/LoginForm';

export interface AuthenticationFormProps extends Pick<BoxProps, 'width'> {
  redirectTo?: string;
}

export const AuthenticationForm = ({
  width,
  redirectTo,
}: AuthenticationFormProps) => {
  const [isSignIn, { toggle }] = useBoolean(true);

  return (
    <VStack alignItems="stretch" spacing={6} textAlign="center" width={width}>
      {isSignIn ? (
        <LoginForm width='full' redirectTo={redirectTo} />
      ) : (
        <LoginForm width='full' redirectTo={redirectTo} signup={true} />
      )}
      <Link onClick={toggle} fontSize="sm">
        {isSignIn
          ? 'Need an account? Register instead'
          : 'Already have an account? Sign in instead'}
      </Link>
    </VStack>
  );
};
