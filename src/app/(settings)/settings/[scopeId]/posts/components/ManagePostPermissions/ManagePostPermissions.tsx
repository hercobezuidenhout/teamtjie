'use client';

import { Card, CardBody, CardHeader, Heading, VStack } from "@chakra-ui/react";
import { ManagePostItem } from "./ManagePostItem";
import { useScopePermissionsQuery } from "@/services/scope/queries/use-scope-permissions-query";
import { PostType, ScopePostPermissionAction } from "@prisma/client";

interface ManagePostPermissionsProps {
    scopeId: number;
}

export const ManagePostPermissions = ({ scopeId }: ManagePostPermissionsProps) => {
    const { data } = useScopePermissionsQuery(scopeId);

    const getRoles = (action: ScopePostPermissionAction, type: PostType) =>
        data?.filter(role => role.action === action && role.type === type);

    return (
        <Card>
            <CardHeader>
                <Heading>Manage Post Permissions</Heading>
            </CardHeader>
            <CardBody>
                <VStack alignItems="stretch" gap={5}>
                    <VStack alignItems="stretch">
                        <Heading>Fines</Heading>
                        <VStack gap={3} alignItems="stretch">
                            <ManagePostItem scopeId={scopeId} action="post" type="FINE" label="Who can post fines" roles={getRoles('post', 'FINE')} />
                            <ManagePostItem scopeId={scopeId} action="read" type="FINE" label="Who can view fines" roles={getRoles('read', 'FINE')} />
                            <ManagePostItem scopeId={scopeId} action="view_author" type="FINE" label="Who can view fine author" roles={getRoles('view_author', 'FINE')} />
                        </VStack>
                    </VStack>
                    <VStack alignItems="stretch">
                        <Heading>Wins</Heading>
                        <VStack gap={3} alignItems="stretch">
                            <ManagePostItem scopeId={scopeId} action="post" type="WIN" label="Who can post wins" roles={getRoles('post', 'WIN')} />
                            <ManagePostItem scopeId={scopeId} action="read" type="WIN" label="Who can view wins" roles={getRoles('read', 'WIN')} />
                            <ManagePostItem scopeId={scopeId} action="view_author" type="WIN" label="Who can view win author" roles={getRoles('view_author', 'WIN')} />
                        </VStack>
                    </VStack>
                    <VStack alignItems="stretch">
                        <Heading>Payments</Heading>
                        <VStack gap={3} alignItems="stretch">
                            <ManagePostItem scopeId={scopeId} action="post" type="PAYMENT" label="Who can post payments" roles={getRoles('post', 'PAYMENT')} />
                            <ManagePostItem scopeId={scopeId} action="read" type="PAYMENT" label="Who can view payments" roles={getRoles('read', 'PAYMENT')} />
                            <ManagePostItem scopeId={scopeId} action="view_author" type="PAYMENT" label="Who can view payment author" roles={getRoles('view_author', 'PAYMENT')} />
                        </VStack>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
};