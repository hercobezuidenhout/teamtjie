import { Flex, VStack } from '@chakra-ui/react';
import { PageProps } from '@/app/page-props';
import { LoginForm } from '@/lib/forms/LoginForm/LoginForm';
import { AuthHeader } from '@/app/(auth)/components/AuthHeader';
import { LoginPageHeader } from '@/app/(auth)/components/LoginPageHeader';

const RETURN_TO_PARAM = 'returnTo';

const LogInPage = ({ searchParams = {} }: PageProps) => {
  const returnToParam = searchParams[RETURN_TO_PARAM];

  const returnTo = Array.isArray(returnToParam)
    ? returnToParam[0]
    : returnToParam;

  return (
    <>
      <AuthHeader />
      <Flex gap={8} alignItems="center" height={{ md: '75vh', lg: '85vh' }} justifyContent="space-around">
        <VStack spacing={8}>
          <LoginPageHeader />
          <LoginForm redirectTo={returnTo} />
        </VStack>
      </Flex>
    </>
  );
};

export default LogInPage;
