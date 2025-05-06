import { VStack } from "@chakra-ui/react";
import { BackToSettingsButton } from "../components/BackToSettingsButton/BackToSettingsButton";
import { PageProps } from "@/app/page-props";
import { securelyGetScopeFromPageProps } from "../utils/securely-get-scope-from-page-props";
import { ManagePostPermissions } from "./components/ManagePostPermissions/ManagePostPermissions";

const Page = async (props: PageProps) => {
    const scope = await securelyGetScopeFromPageProps(props);

    return (
        <VStack width={["fit-content", "2xl"]} m="auto" spacing={5} align="stretch">
            <BackToSettingsButton scope={scope} />
            <ManagePostPermissions scopeId={scope.id} />
        </VStack>
    );
};

export default Page;