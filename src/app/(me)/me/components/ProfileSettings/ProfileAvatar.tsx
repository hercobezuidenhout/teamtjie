'use client';

import { UpdateAvatarModal } from "@/lib/modals/UpdateAvatarModal/UpdateAvatarModal";
import { Avatar, useDisclosure } from "@chakra-ui/react";
import { User } from "@prisma/client";

interface ProfileAvatarProps {
    user: User;
}

export const ProfileAvatar = ({ user }: ProfileAvatarProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleClick = () => {
        onOpen();
    };

    return (
        <>
            <Avatar onClick={handleClick} name={user.name} src={user.image ?? undefined} size="lg" cursor="pointer" transition="0.3s" _hover={{
                opacity: 0.8
            }} />
            <UpdateAvatarModal isOpen={isOpen} onClose={onClose} profileId={user.id} profileType="USER" />
        </>
    );
};