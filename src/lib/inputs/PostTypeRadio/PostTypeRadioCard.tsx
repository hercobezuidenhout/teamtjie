'use client';

import { Box, Heading, RadioProps, useRadio } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const PostTypeRadioCard = (props: PropsWithChildren & RadioProps) => {
    const { getInputProps, getRadioProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label" width="full" textAlign="center">
            <input {...input} hidden />
            <Box
                {...checkbox}
                cursor='pointer'
                paddingY={2}
                borderRadius="md"
                _checked={{
                    bg: 'chakra-primary-color-soft',
                    border: "1px solid",
                    borderColor: 'chakra-primary-color',
                }}
                _focus={{
                    boxShadow: 'outline',
                }}>
                <Heading size="sm">{props.children}</Heading>
            </Box>
        </Box>
    );
};