'use client';

import { Button, Icon } from '@chakra-ui/react';
import { BiLogoMicrosoft } from 'react-icons/bi';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface SignInWithMicrosoftButtonProps {
  redirectTo?: string;
}

export const SignInWithMicrosoftButton = ({ redirectTo }: SignInWithMicrosoftButtonProps) => {
  const supabase = useSupabaseClient();

  const signInWithMicrosoft = () => {

    void supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email,offline_access',
        redirectTo: `${location.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    });
  };

  return (
    <Button
      onClick={signInWithMicrosoft}
      variant="outline"
      leftIcon={<Icon as={BiLogoMicrosoft} />}
      width="full"
    >
      Continue with Microsoft
    </Button>
  );
};
