'use client';

import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiArrowLeftCircle } from "react-icons/fi";

export const BackToAccountButton = () => {
    const ACCOUNT_SETTINGS = '/me';
    const router = useRouter();
    const navigateBack = () => router.push(ACCOUNT_SETTINGS);

    return (
        <Button onClick={navigateBack} leftIcon={<Icon as={FiArrowLeftCircle} />} size="sm" width="fit-content" px={4} variant="ghost">Back to account</Button>
    );
};