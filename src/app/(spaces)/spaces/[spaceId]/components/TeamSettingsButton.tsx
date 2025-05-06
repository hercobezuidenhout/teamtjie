'use client';

import { Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FiSliders } from "react-icons/fi";

interface TeamSettingsButtonProps {
    scope: Scope;
}

export const TeamSettingsButton = ({ scope }: TeamSettingsButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        const path = `/settings/${scope.id}`;
        router.push(path);
    };

    return (
        <Tooltip label='Settings' borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text">
            <IconButton aria-label="Charter" icon={<Icon as={FiSliders} />} onClick={handleClick} />
        </Tooltip>
    );
};