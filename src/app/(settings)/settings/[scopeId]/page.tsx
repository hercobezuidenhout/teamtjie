import { Heading, VStack } from "@chakra-ui/react";
import { BackToScopeButton } from "./components/BackToScopeButton/BackToScopeButton";
import { PageProps } from "@/app/page-props";
import { GeneralSettings } from "./components/GeneralSettings/GeneralSettings";
import { PermissionSettings } from "./components/PermissionSettings/PermissionSettings";
import { DangerZoneSettings } from "./components/DangerZoneSettings/DangerZoneSettings";
import { securelyGetScopeFromPageProps } from "./utils/securely-get-scope-from-page-props";
import { EmailSettings } from "./components/EmailSettings/EmailSettings";

const Page = async ({ ...rest }: PageProps) => {
    const scope = await securelyGetScopeFromPageProps({ action: 'access', ...rest });

    return (
        <VStack width={["fit-content", "2xl"]} m="auto" mt={5} spacing={5} align="stretch">
            <BackToScopeButton scope={scope} />
            <Heading size="lg">{scope.name} Settings</Heading>
            <GeneralSettings scope={scope} />
            <PermissionSettings scope={scope} />
            <EmailSettings scope={scope} />
            <DangerZoneSettings scope={scope} />
        </VStack>
    );
};

export default Page;