'use client';

import { Button, Icon } from "@chakra-ui/react";
import { Scope } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";

interface BackToScopeButtonProps {
    scope: Scope;
}

export const BackToScopeButton = ({ scope }: BackToScopeButtonProps) => {
    const SCOPE = `/settings/${scope.id}`;
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFromSettings = !!searchParams?.get('isFromSettings');

    const navigateBack = () => router.push(SCOPE);

    return (
        <Button hidden={!isFromSettings ?? false} onClick={navigateBack} leftIcon={<Icon as={FiArrowLeftCircle} />} size="sm" width="fit-content" px={4} variant="secondary">
            Back to settings
        </Button>
    );
};