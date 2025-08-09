import { VStack } from "@chakra-ui/react";
import { BackToSettingsButton } from "../components/BackToSettingsButton/BackToSettingsButton";
import { PageProps } from "@/app/page-props";
import { ManageMembers } from "./components/ManageMembers/ManageMembers";
import { securelyGetScopeFromPageProps } from "../utils/securely-get-scope-from-page-props";

const Page = async ({ ...rest }: PageProps) => {
    const scope = await securelyGetScopeFromPageProps(rest);

    return (
        <VStack width={["full", "2xl"]} m="auto" spacing={5} align="stretch">
            <BackToSettingsButton scope={scope} />
            <ManageMembers id={scope.id} />
        </VStack>
    );
};

export default Page;