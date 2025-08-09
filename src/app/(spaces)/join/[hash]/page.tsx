import { PageProps } from "@/app/page-props";
import { InvitationDetails } from "./components/InvitationDetails";
import { getInvitationByHash, getUserExists, getUserWithRoles } from "@/prisma";
import { Button, Card, CardBody, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { getSession } from "@/app/utils";
import { subject } from "@casl/ability";
import { InvitationResponse } from "@/models/types/prisma";
import { getPermissions } from "@/permissions/permissions";

const getLabel = (
    invitation: InvitationResponse | undefined
) => {
    if (!invitation) {
        return undefined;
    }

    return {
        id: invitation.scope.id,
        type: invitation.scope.parentScopeId ? 'team' : 'space',
        name: invitation.scope.name,
        href: invitation.scope.parentScopeId
            ? `/spaces/${invitation.scope.parentScopeId}/teams/${invitation.scope.id}`
            : `/spaces/${invitation.scope.id}`,
    };
};

const Page = async ({ params }: PageProps) => {
    const hash = params['hash'];
    const invitation = await getInvitationByHash(hash);

    const session = await getSession();

    if (!invitation || invitation === null) {
        return (
            <Flex height="85vh" justifyContent="space-around" alignItems="center">
                <Card>
                    <CardBody>
                        <Text>👋 The invite you have been looking for was not found.</Text>
                    </CardBody>
                </Card>
            </Flex>
        );
    }

    const label = getLabel(invitation);

    if (session) {
        const userExists = await getUserExists({ id: session?.user.id });

        if (userExists) {
            const user = await getUserWithRoles(session.user.id);
            const ability = await getPermissions(user.id);

            if (ability.can('read', subject('Scope', { id: invitation.scopeId }))) {
                return (
                    <VStack gap={6} textAlign="center">
                        <Heading>
                            You are already a member of {label?.name}!
                        </Heading>
                        <Button variant="primary" as={Link} href={label?.href}>
                            Go there now
                        </Button>
                    </VStack>
                );
            }
        }
    }

    return (
        <InvitationDetails invitation={invitation} label={label} />
    );
};

export default Page;