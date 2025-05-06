'use client';

import { useCheckbox, UseCheckboxProps, Text, Box, Spinner } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface NotificationPreferenceCheckboxProps extends UseCheckboxProps, PropsWithChildren {
    isLoading?: boolean;
}

export const NotificationPreferenceCheckbox = ({ children, isLoading = false, ...rest }: NotificationPreferenceCheckboxProps) => {
    const { getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox({ isDisabled: isLoading, ...rest });

    return (
        <Box as="label" width="full" textAlign="center" minWidth="5rem">
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
                    borderColor: 'chakra-primary',
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