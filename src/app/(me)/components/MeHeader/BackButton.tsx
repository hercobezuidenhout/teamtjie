'use client';

import { Icon, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiHome } from "react-icons/fi";

export const BackButton = () => {
    const HOME = '/';
    const router = useRouter();

    const navigateToHome = () => router.push(HOME);

    return (
        <IconButton aria-label="Back to app" onClick={navigateToHome} icon={<Icon as={FiHome} />} variant="secondary" />
    );
};