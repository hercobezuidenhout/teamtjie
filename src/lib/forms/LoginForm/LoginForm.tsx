'use client';

import { VStack } from '@chakra-ui/layout';
import { Flex, Link, Text } from '@chakra-ui/react';
import { OtpLogin } from './OtpLogin';

interface LoginFormProps {
  redirectTo?: string;
  signup?: boolean;
  width?: string;
}

export const LoginForm = ({ redirectTo = '/', signup, width }: LoginFormProps) => {
  return (
    <>
      <VStack spacing={3} alignItems="stretch" gap={8}>
        <VStack alignItems="stretch" gap={5}>
          <OtpLogin width={width} redirectTo={redirectTo} />
        </VStack>
      </VStack>
      <Flex justifyContent="space-around">
        {signup
          ? (
            <Text>Already have an account? <Link href="/login"><b>Login</b></Link></Text>
          )
          : (
            <Text>Don&apos;t have an account? <Link href="/signup"><b>Sign Up</b></Link></Text>
          )
        }
      </Flex>
    </>
  );
};
