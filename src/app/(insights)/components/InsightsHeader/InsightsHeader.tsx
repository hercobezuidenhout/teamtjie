import { ProfileMenu } from "@/app/(spaces)/spaces/[spaceId]/components/ProfileMenu";
import { SupportMenu } from "@/app/(spaces)/spaces/[spaceId]/components/SupportMenu";
import { VStackStretch } from "@/lib/layout/VStackStretch";
import { HStack, Heading, Divider } from "@chakra-ui/react";
import { BackButton } from "./BackButton";

export const InsightsHeader = () => {

    return (
        <VStackStretch>
            <HStack width="full" margin="auto" py={{ base: 2, md: 2 }} px={{ base: 2, md: 3 }} justifyContent="space-between" backgroundColor="chakra-body-bg">
                <HStack gap={{ base: 0, md: 2 }}>
                    <HStack>
                        <Heading display={{ base: 'none', md: 'block' }}>✨ Teamtjie</Heading>
                    </HStack>
                    <Divider orientation="vertical" height={5} />
                    <BackButton />
                </HStack>


                <HStack gap={{ base: 2, md: 2 }}>
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