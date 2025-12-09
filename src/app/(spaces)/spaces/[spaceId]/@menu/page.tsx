import { PageProps } from '@/app/page-props';
import { VStack } from '@chakra-ui/react';
import { getScopeProfile } from '@/prisma';
import { hasActiveSubscription } from '@/prisma/queries/subscription-queries';
import { ScopeValues } from './components/ScopeValues/ScopeValues';
import { ScopeMission } from './components/ScopeMission/ScopeMission';
import { DailySentimentWidget } from './components/DailySentiment/DailySentimentWidget';
import { DailySentimentPromo } from './components/DailySentiment/DailySentimentPromo';

const Page = async ({ params }: PageProps) => {
    const scopeId = Number(params['spaceId']);
    const scope = await getScopeProfile(scopeId);
    const hasSubscription = await hasActiveSubscription(scopeId);

    return (
        <VStack align="stretch" gap={4}>
            {hasSubscription ? <DailySentimentWidget /> : <DailySentimentPromo scopeId={scopeId} />}
            <ScopeMission mission={scope.description || undefined} />
            <ScopeValues id={scope.id} />
        </VStack>
    );
};

export default Page;