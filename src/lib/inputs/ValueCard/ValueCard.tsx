'use client';

import { Box, CheckboxProps, HStack, Tag, Text, useCheckbox } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface ValueCardProps extends PropsWithChildren, CheckboxProps {
    index?: number;
}

export const ValueCard = ({ index, children, ...props }: ValueCardProps) => {
    const { getInputProps, getCheckboxProps } = useCheckbox(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label" width="full" cursor="pointer">
            <input {...input} hidden />
            <Box
                {...checkbox}
                cursor='pointer'
                paddingX={{ base: 3, md: 4 }}
                paddingY={{ base: 2.5, md: 3 }}
                borderRadius="md"
                borderWidth="1px"
                borderColor="chakra-subtle-bg"
                backgroundColor="chakra-body-bg"
                transition="all 0.2s"
                _hover={{
                    borderColor: 'chakra-primary-color',
                    backgroundColor: 'chakra-subtle-bg',
                }}
                _checked={{
                    bg: 'chakra-primary-color-soft',
                    borderColor: 'chakra-primary-color',
                    borderWidth: '2px',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}>
                <HStack spacing={3} justifyContent="flex-start">
                    {index !== undefined && (
                        <Tag borderRadius="full" size="sm" bg="chakra-primary-color" color="chakra-inverse-text">
                            {index}
                        </Tag>
                    )}
                    <Text fontSize="sm" fontWeight="medium">{children}</Text>
                </HStack>
            </Box>
        </Box>
    );
};
