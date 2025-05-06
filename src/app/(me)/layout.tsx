import { VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { MeHeader } from "./components/MeHeader/MeHeader";
import { getUserWithRoles } from "@/prisma";
import { getSession } from "../utils";
import { notFound } from "next/navigation";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

const Layout = async ({ children }: PropsWithChildren) => {
    const session = await getSession();

    if (!session || !session.user) {
        notFound();
    }

    const user = await getUserWithRoles(session.user.id);

    const queryClient = new QueryClient();
    queryClient.setQueryData(['users', 'current'], user);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <VStack align="stretch" width="full" paddingX={{ base: 2, md: 0 }}>
                <MeHeader />
                <VStack alignItems="stretch" width="full" maxW={{ base: 'full', md: '2xl' }} margin="auto">
                    {children}
                </VStack>
            </VStack>
        </HydrationBoundary>
    );
};

export default Layout;