import { getUserAndScopes } from '@/app/(spaces)/spaces/[spaceId]/utils';
import { notFound } from 'next/navigation';
import { PageProps } from '@/app/page-props';
import { VStack } from '@chakra-ui/react';
import { Feed } from '../../components/Feed';
import { TeamHeader } from '../../components/TeamHeader';
import { getScopeProfile } from '@/prisma';
import { PostForm } from '@/lib/forms/PostForm/PostForm';

const TeamPage = async ({ params }: PageProps) => {
    const data = await getUserAndScopes();
    const teamId = Number.parseInt(params['teamId']);
    const spaceId = Number.parseInt(params['spaceId']);
    const scope = await getScopeProfile(teamId);

    if (!data) {
        notFound();
    };

    // const permissions = await getPermissions(data.user.id);

    // if (!permissions.can('read', subject('Scope', { id: scope.id }))) {
    //     notFound();
    // }

    return (
        <VStack width={["fit-content", "2xl"]} m="auto" spacing={5}>
            <TeamHeader scope={scope} />
            <PostForm scope={scope} />
            <Feed scopeId={spaceId} filterId={teamId} />
        </VStack>
    );
};

export default TeamPage;
