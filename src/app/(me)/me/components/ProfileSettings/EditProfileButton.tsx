'use client';

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const EditProfileButton = () => {
    const EDIT_PROFILE = '/me/profile';
    const router = useRouter();

    const navigateToEditProfile = () => router.push(EDIT_PROFILE);

    return (
        <Button variant="secondary" size="sm" px={5} onClick={navigateToEditProfile}>Edit Profile</Button>
    );
};