'use client';

import { LoadingButton } from '@/lib/buttons/LoadingButton/LoadingButton';
import { PinInput, PinInputField, HStack, VStack, useToast } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


interface VerifyOtpFormProps {
  redirectTo?: string;
  email: string;
}

export const VerifyOtpForm = ({ redirectTo, email }: VerifyOtpFormProps) => {
  const supabase = useSupabaseClient();
  const toast = useToast();
  const router = useRouter();
  const [otp, setOtp] = useState<string>('');
  const [verifying, setVerifying] = useState(false);

  const verifyOtp = async (otpToVerify?: string) => {
    setVerifying(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otpToVerify ? otpToVerify : otp,
      type: 'magiclink'
    });

    if (error) {
      console.error(error.cause, error.stack);
      toast({ title: error.message, variant: 'error' });
      setVerifying(false);
      return;
    }

    console.info(data);

    setVerifying(false);

    router.push(redirectTo ? redirectTo : '/spaces');
  };

  const handleOtpChange = (value) => {
    setOtp(value);

    if (value.length === 6) {
      verifyOtp(value);
    }
  };

  return (
    <VStack spacing={3} alignItems="stretch" gap={8}>
      <VStack alignItems="stretch" gap={5}>
        <HStack>
          <PinInput value={otp} onChange={handleOtpChange}>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>
        <LoadingButton disabled={verifying} isLoading={verifying} onClick={verifyOtp} size="lg" variant="primary" width="full">Continue</LoadingButton>
      </VStack>
    </VStack>
  );
};
