import { Heading, VStack } from "@chakra-ui/react";
import { PageProps } from "@/app/page-props";
import { securelyGetScopeFromPageProps } from "@/app/(settings)/settings/[scopeId]/utils/securely-get-scope-from-page-props";
import { BackToScopeButton } from "../../components/BackToScopeButton/BackToScopeButton";
import { TeamInsights } from "./components/TeamInsights";

const Page = async ({ ...rest }: PageProps) => {
    const scope = await securelyGetScopeFromPageProps({ action: 'edit', ...rest });

    return (
        <VStack width={["fit-content", "2xl"]} m="auto" spacing={5} align="stretch">
            <BackToScopeButton scope={scope} />
            <Heading size="lg">{scope.name} Insights</Heading>
            <TeamInsights scopeId={scope.id} />
        </VStack>
    );
};

export default Page;