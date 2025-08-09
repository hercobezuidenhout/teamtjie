import { PageProps } from '@/app/page-props';
import { VStack } from '@chakra-ui/react';
import { getScopeProfile } from '@/prisma';
import { ScopeValues } from '../../components/ScopeValues/ScopeValues';
import { ScopeMission } from '../../components/ScopeMission/ScopeMission';

const Page = async ({ params }: PageProps) => {
    const scopeId = Number(params['teamId']);
    const scope = await getScopeProfile(scopeId);

    return (
        <VStack align="stretch" gap={4}>
            <ScopeMission mission={scope.description || undefined} />
            <ScopeValues id={scope.id} />
        </VStack>
    );
};

export default Page;