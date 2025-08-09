import { VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { SettingsHeader } from "./SettingsHeader/SettingsHeader";

const Layout = async ({ children }: PropsWithChildren) => {
    return (
        <VStack align="stretch" width="full" paddingX={{ base: 2, md: 0 }}>
            <SettingsHeader />
            <VStack alignItems="stretch" width="full" maxW={{ base: 'full', md: '2xl' }} margin="auto">
                {children}
            </VStack>
        </VStack>
    );
};

export default Layout;