'use client';

import { Flex, HStack, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { IconType } from "react-icons/lib";

interface SettingsItemProps {
    icon: IconType;
    name: string;
    href: string;
}

export const SettingsItem = ({ icon, name, href }: SettingsItemProps) => (
    <Link href={href}>
        <HStack cursor="pointer" borderRadius="md" pr={2} justifyContent="space-between" transition="0.3s" _hover={{
            backgroundColor: "chakra-primary-color-soft"
        }}>
            <HStack>
                <Flex backgroundColor="chakra-primary-color-soft" padding="3" borderRadius="md">
                    <Icon as={icon} color="chakra-primary-color" />
                </Flex>
                <Text fontWeight="bold">{name}</Text>
            </HStack>
            <Icon color="chakra-primary-color" as={FiChevronRight} />
        </HStack>
    </Link>
);