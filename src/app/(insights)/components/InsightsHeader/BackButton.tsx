'use client';

import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiHome } from "react-icons/fi";

export const BackButton = () => {
    const HOME = '/';
    const router = useRouter();

    const navigateToHome = () => router.push(HOME);

    return (
        <Button onClick={navigateToHome} leftIcon={<Icon as={FiHome} />} variant="secondary">Back to App</Button>
    );
};