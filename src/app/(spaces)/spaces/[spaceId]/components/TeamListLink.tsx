'use client';

import { Avatar, HStack, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TeamListLinkProps {
    name: string;
    image?: string;
    href: string;
}

export const TeamListLink = ({ href, name, image }: TeamListLinkProps) => {
    const pathname = usePathname();

    return (
        <Link href={href}>
            <HStack cursor="pointer" backgroundColor={pathname == href ? "chakra-primary-color-soft" : ""} width="full" paddingY="2" paddingX="2" borderRadius="md">
                <Avatar name={name} size="sm" src={image} />
                <Heading size="sm">{name}</Heading>
            </HStack>
        </Link>
    );
};