import { Flex, VStack } from '@chakra-ui/react';
import { PageProps } from '@/app/page-props';
import { AuthHeader } from '@/app/(auth)/components/AuthHeader';
import { VerifyOtpPageHeader } from './components/VerifyOtpPageHeader';
import { VerifyOtpForm } from './components/VerifyOtpForm';

const RETURN_TO_PARAM = 'redirectTo';
const EMAIL_PARAM = 'email';

const VerifyOtpPage = ({ searchParams = {} }: PageProps) => {
    const returnToParam = searchParams[RETURN_TO_PARAM];
    const emailParam = searchParams[EMAIL_PARAM];

    const returnTo = Array.isArray(returnToParam)
        ? returnToParam[0]
        : returnToParam;

    const email = Array.isArray(emailParam)
        ? emailParam[0]
        : emailParam;

    return (
        <>
            <AuthHeader />
            <Flex gap={8} alignItems="center" height={{ base: '75vh', sm: '75vh' }} justifyContent="space-around">
                <VStack spacing={8}>
                    <VerifyOtpPageHeader />
                    <VerifyOtpForm email={String(email)} redirectTo={returnTo} />
                </VStack>
            </Flex>
        </>
    );
};

export default VerifyOtpPage;
