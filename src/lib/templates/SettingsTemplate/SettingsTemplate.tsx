'use client';

import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { VStackStretch } from "@/lib/layout/VStackStretch";
import { PropsWithChildren } from "react";

interface SettingsTemplateProps extends PropsWithChildren {
    title: string;
}

export const SettingsTemplate = ({ title, children }: SettingsTemplateProps) => {

    return (
        <Card>
            <CardHeader>
                <Heading>{title}</Heading>
            </CardHeader>
            <CardBody pt={0}>
                <VStackStretch gap={3}>
                    {children}
                </VStackStretch>
            </CardBody>
        </Card>
    );
};