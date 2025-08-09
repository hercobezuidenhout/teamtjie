'use client';

import { Button, Icon } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";

interface BackToScopeButtonProps {
    scope: Scope;
}

export const BackToScopeButton = ({ scope }: BackToScopeButtonProps) => {
    const SCOPE = `/spaces/${scope.id}`;
    const router = useRouter();
    const navigateBack = () => router.push(SCOPE);

    return (
        <Button onClick={navigateBack} leftIcon={<Icon as={FiArrowLeftCircle} />} size="sm" width="fit-content" px={4} variant="secondary">
            Back to team
        </Button>
    );
};