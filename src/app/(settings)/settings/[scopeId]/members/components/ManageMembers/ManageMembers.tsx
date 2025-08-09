'use client';

import { useScopeQuery } from "@/services/scope/queries/use-scope-query";
import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { MembersList } from "./MembersList";

interface ManageMembersProps {
    id: number;
}

export const ManageMembers = ({ id }: ManageMembersProps) => {
    const { data: currentScope } = useScopeQuery(id);

    return (
        <Card>
            <CardHeader>
                <Heading>Manage Members</Heading>
            </CardHeader>
            <CardBody pt={0}>
                {currentScope && <MembersList scope={currentScope} />}
            </CardBody>
        </Card>
    );
};