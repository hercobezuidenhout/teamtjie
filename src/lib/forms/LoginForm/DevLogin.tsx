'use client';

import { FormInput } from '@/lib/inputs/FormInput/FormInput';
import { LoadingButton } from '@/lib/buttons/LoadingButton/LoadingButton';
import { FormContainer } from '@/lib/forms/FormContainer/FormContainer';
import { VStack, useToast } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type DevLoginFormData = {
  email: string;
};

interface DevLoginProps {
  redirectTo?: string;
  width?: string;
}

export const DevLogin = ({ redirectTo, width }: DevLoginProps) => {
  const DEFAULT_PASSWORD = 'afoxjumpedthepark';
  const supabase = useSupabaseClient();
  const formMethods = useForm<DevLoginFormData>();
  const email = formMethods.watch('email');
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    const response = await fetch(`/auth/deactivated?email=${email}`);
    const isDeactivated = await response.json();

    if (isDeactivated) {
      router.push('/deactivated');
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: DEFAULT_PASSWORD });

    if (error) {
      toast({ title: error.message, variant: 'error' });
      return;
    }

    console.info(data);

    setIsLoading(false);

    router.push(redirectTo ? redirectTo : '/spaces');
  };

  return (
    <FormContainer name="Sign in" onSubmit={formMethods.handleSubmit(onSubmit, () => setIsLoading(false))} width={width ? width : { base: 'full', md: 'md', lg: 'lg' }}>
      <FormProvider {...formMethods} >
        <VStack align="stretch" spacing={5}>
          <FormInput name="email" required placeholder="name@example.com" size="lg" />
          <LoadingButton size="lg" width="full" type="submit" variant="primary" isLoading={isLoading}>
            Continue
          </LoadingButton>
        </VStack>
      </FormProvider>
    </FormContainer>
  );
};