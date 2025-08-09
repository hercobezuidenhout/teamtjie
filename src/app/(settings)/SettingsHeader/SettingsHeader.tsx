import { ProfileMenu } from "@/app/(spaces)/spaces/[spaceId]/components/ProfileMenu";
import { SupportMenu } from "@/app/(spaces)/spaces/[spaceId]/components/SupportMenu";
import { VStackStretch } from "@/lib/layout/VStackStretch";
import { Divider, HStack, Heading } from "@chakra-ui/react";
import { BackButton } from "../../(insights)/components/InsightsHeader/BackButton";

export const SettingsHeader = () => (
    <VStackStretch>
        <HStack width="full" margin="auto" py={1} px={3} justifyContent="space-between" backgroundColor="white" borderBottomColor="chakra-subtle-bg" borderWidth="1px">
            <HStack gap={{ base: 2, md: 5 }}>
                <HStack>
                    <Heading display={{ base: 'none', md: 'block' }}>Teamtjie</Heading>
                </HStack>
                <Divider orientation="vertical" height={5} />
                <BackButton />
            </HStack>


            <HStack gap={{ base: 2, md: 5 }}>
                <HStack>
                    <SupportMenu />
                </HStack>
                <Divider orientation="vertical" height={5} />
                <ProfileMenu />
            </HStack>
        </HStack>
    </VStackStretch>
);