'use client';

import { Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FiActivity } from "react-icons/fi";

interface TeamInsightsButtonProps {
    scope: Scope;
}

export const TeamInsightsButton = ({ scope }: TeamInsightsButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        const spaceId = scope.parentScopeId ? scope.parentScopeId : scope.id;
        const path = `/insights/${spaceId}`;
        router.push(path);
    };

    return (
        <Tooltip label='Insights' borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text">
            <IconButton aria-label="Insights" icon={<Icon as={FiActivity} />} onClick={handleClick} />
        </Tooltip>
    );
};