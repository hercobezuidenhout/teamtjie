'use client';

import { Box, Icon, IconButton } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";

interface NewPostFabButtonProps {
    onClick: () => void;
}

export const NewPostFabButton = ({ onClick }: NewPostFabButtonProps) => {
    return (
        <>
            <Box position="fixed" bottom={5} right={4} zIndex={10} display={{ base: 'block', md: 'none' }}>
                <IconButton aria-label="compose" icon={<Icon as={FiEdit} />} onClick={onClick} variant="primary" size="lg" />
            </Box>
        </>
    );
};