'use client';

import { Button, Icon } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";

interface BackToSettingsButtonProps {
    scope: Scope;
}

export const BackToSettingsButton = ({ scope }: BackToSettingsButtonProps) => {
    const TEAM_SETTINGS = `/settings/${scope.id}`;

    const router = useRouter();
    const navigateBack = () => router.push(TEAM_SETTINGS);

    return (
        <Button onClick={navigateBack} leftIcon={<Icon as={FiArrowLeftCircle} />} size="sm" width="fit-content" px={4} variant="ghost">Back to settings</Button>
    );
};