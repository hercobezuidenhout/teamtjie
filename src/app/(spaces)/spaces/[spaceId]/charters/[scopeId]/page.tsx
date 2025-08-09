import { PageProps } from "@/app/page-props";
import { getScopeProfile } from "@/prisma";
import { ScopeCharterProfile } from "./components/ScopeProfile/ScopeCharterProfile";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ScopeCharterValues } from "./components/ScopeCharterValues/ScopeCharterValues";
import { ScopeCharterMission } from "./components/ScopeCharterMission/ScopeCharterMission";
import { VStack } from "@chakra-ui/react";
import { BackToScopeButton } from "./components/BackToScopeButton/BackToScopeButton";

const Page = async ({ params }: PageProps) => {
    const scopeId = Number(params['scopeId']);
    const scope = await getScopeProfile(scopeId);

    if (!scope) {
        notFound();
    }

    const queryClient = new QueryClient();
    queryClient.setQueryData(['scopes', scopeId], scope);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <VStack align="stretch" width={['full', 'md', '2xl']} m="auto" spacing={5} gap={3}>
                <BackToScopeButton scope={scope} />
                <ScopeCharterProfile id={scope.id} />
                <ScopeCharterMission id={scope.id} />
                <ScopeCharterValues id={scope.id} />
            </VStack>
        </HydrationBoundary>
    );
};

export default Page;