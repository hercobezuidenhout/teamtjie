import { ModalHeader, HStack, Avatar, Heading } from "@chakra-ui/react";
import { Scope } from "@prisma/client";

interface PostModalHeaderProps {
    scope: Scope,
    onChangeScope: () => void;
}

export const PostModalHeader = ({ scope }: PostModalHeaderProps) => (
    <ModalHeader>
        <HStack justifyContent="space-between">
            <HStack>
                <Avatar size="sm" src={scope.image ?? undefined} name={scope.name} />
                <Heading>{scope.name}</Heading>
            </HStack>
        </HStack>
    </ModalHeader>
);