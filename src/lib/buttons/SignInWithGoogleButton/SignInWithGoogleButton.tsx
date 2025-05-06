'use client';

import { BiLogoGoogle } from 'react-icons/bi';
import { Button, Icon } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface SignInWithGoogleButtonProps {
  redirectTo?: string;
}

export const SignInWithGoogleButton = ({
  redirectTo,
}: SignInWithGoogleButtonProps) => {
  const supabase = useSupabaseClient();

  const signInWithGoogle = () => {

    void supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?redirectTo=${redirectTo}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant="outline"
      leftIcon={<Icon as={BiLogoGoogle} />}
      width="full"
    >
      Google
    </Button>
  );
};
