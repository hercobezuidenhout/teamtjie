import { PageProps } from '@/app/page-props';
import { VStack } from '@chakra-ui/react';
import { getScopeProfile } from '@/prisma';
import { ScopeValues } from './components/ScopeValues/ScopeValues';
import { ScopeMission } from './components/ScopeMission/ScopeMission';
import { DailySentimentWidget } from './components/DailySentiment/DailySentimentWidget';

const Page = async ({ params }: PageProps) => {
    const scopeId = Number(params['spaceId']);
    const scope = await getScopeProfile(scopeId);

    return (
        <VStack align="stretch" gap={4}>
            <DailySentimentWidget />
            <ScopeMission mission={scope.description || undefined} />
            <ScopeValues id={scope.id} />
        </VStack>
    );
};

export default Page;