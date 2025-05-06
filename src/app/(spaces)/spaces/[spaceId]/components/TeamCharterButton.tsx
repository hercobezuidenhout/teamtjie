'use client';

import { Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FiAward } from "react-icons/fi";

interface TeamCharterButtonProps {
    scope: Scope;
}

export const TeamCharterButton = ({ scope }: TeamCharterButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        const spaceId = scope.parentScopeId ? scope.parentScopeId : scope.id;
        const path = `/spaces/${spaceId}/charters/${scope.id}`;
        router.push(path);
    };

    return (
        <Tooltip label='Charter' borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text">
            <IconButton aria-label="Charter" icon={<Icon as={FiAward} />} onClick={handleClick} />
        </Tooltip>
    );
};