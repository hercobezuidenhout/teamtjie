import { VStack } from "@chakra-ui/react";
import { BackToSettingsButton } from "../components/BackToSettingsButton/BackToSettingsButton";
import { securelyGetScopeFromPageProps } from "../utils/securely-get-scope-from-page-props";
import { PageProps } from "@/app/page-props";
import { LeaveTeam } from "./components/LeaveTeam";

const Page = async ({ ...rest }: PageProps) => {
    const scope = await securelyGetScopeFromPageProps({ action: 'access', ...rest });

    return (
        <VStack width={["fit-content", "2xl"]} m="auto" spacing={5} align="stretch">
            <BackToSettingsButton scope={scope} />
            <LeaveTeam scopeId={scope.id} />
        </VStack>
    );
};

export default Page;