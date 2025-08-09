'use client';

import { HStack, Heading, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiZap } from "react-icons/fi";

interface FeedLinkProps {
    href: string;
}

export const FeedLink = ({ href }: FeedLinkProps) => {
    const pathname = usePathname();

    return (
        <Link href={href}>
            <HStack cursor="pointer" backgroundColor={pathname === href ? "chakra-primary-color-soft" : ""} width="full" paddingY="3" paddingX="3" borderRadius="md">
                <Icon color="chakra-primary-color" fontSize="2xl" as={FiZap} />
                <Heading size="sm">Feed</Heading>
            </HStack>
        </Link>
    );
};