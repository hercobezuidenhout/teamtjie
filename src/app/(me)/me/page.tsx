import { VStack } from "@chakra-ui/react";
import { AccountSettings } from "./components/AccountSettings/AccountSettings";
import { DangerZoneSettings } from "./components/DangerZoneSettings/DangerZoneSettings";
import { ProfileSettings } from "./components/ProfileSettings/ProfileSettings";

const Page = async () => {
    return (
        <VStack width={["fit-content", "2xl"]} m="auto" mt={5} spacing={5} align="stretch">
            <ProfileSettings />
            <AccountSettings />
            <DangerZoneSettings />
        </VStack >
    );
};

export default Page;