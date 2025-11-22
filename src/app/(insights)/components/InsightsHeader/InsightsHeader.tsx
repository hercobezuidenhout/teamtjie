import { ProfileMenu } from "@/app/(spaces)/spaces/[spaceId]/components/ProfileMenu";
import { SupportMenu } from "@/app/(spaces)/spaces/[spaceId]/components/SupportMenu";
import { VStackStretch } from "@/lib/layout/VStackStretch";
import { HStack, Heading, Divider } from "@chakra-ui/react";
import { BackButton } from "./BackButton";

export const InsightsHeader = () => {

    return (
        <VStackStretch>
            <HStack width={{ base: 'full', md: 'container.xl' }} margin="auto" py={3} justifyContent="space-between">
                <HStack gap={{ base: 2, md: 5 }}>
                    <HStack>
                        <Heading display={{ base: 'none', md: 'block' }}>✨ Teamtjie</Heading>
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
};