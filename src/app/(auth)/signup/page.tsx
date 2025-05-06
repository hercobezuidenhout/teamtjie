import { Flex, VStack } from '@chakra-ui/react';
import { PageProps } from '@/app/page-props';
import { AuthHeader } from '@/app/(auth)/components/AuthHeader';
import { LoginPageHeader } from '@/app/(auth)/components/LoginPageHeader';
import { LoginForm } from '@/lib/forms/LoginForm/LoginForm';

const RETURN_TO_PARAM = 'returnTo';

const SignupPage = ({ searchParams = {} }: PageProps) => {
  const returnToParam = searchParams[RETURN_TO_PARAM];

  const returnTo = Array.isArray(returnToParam)
    ? returnToParam[0]
    : returnToParam;

  return (
    <>
      <AuthHeader signup={true} />
      <Flex gap={8} alignItems="center" height={{ md: '75vh', lg: '85vh' }} justifyContent="space-around">
        <VStack spacing={8}>
          <LoginPageHeader signup={true} />
          <LoginForm signup={true} redirectTo={returnTo} />
        </VStack>
      </Flex>
    </>
  );
};

export default SignupPage;
