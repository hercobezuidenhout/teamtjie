'use client';

import { useCheckbox, UseCheckboxProps, Text, Box, Spinner } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface PostPermissionCheckboxProps extends UseCheckboxProps, PropsWithChildren {
    isLoading?: boolean;
}

export const PostPermissionCheckbox = ({ children, isLoading = false, ...rest }: PostPermissionCheckboxProps) => {
    const { getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox({ isDisabled: isLoading, ...rest });

    return (
        <Box as="label" width="full" textAlign="center">
            <input {...getInputProps()} hidden width="full" />
            <Box
                {...htmlProps}
                {...getCheckboxProps()}
                cursor='pointer'
                padding={2}
                borderRadius="md"
                width="100%"
                color='chakra-primary-color'
                border="1px solid"
                borderColor='chakra-primary-color-soft'
                _checked={{
                    bg: 'chakra-primary-color',
                    color: 'white',
                    borderColor: 'chakra-primary-color',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}>
                {isLoading ? (
                    <Spinner size="xs" />
                ) : (
                    <Text {...getLabelProps()}>{children}</Text>
                )}
            </Box>
        </Box >
    );
};