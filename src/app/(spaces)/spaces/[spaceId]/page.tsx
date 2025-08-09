import { getUserAndScopes } from '@/app/(spaces)/spaces/[spaceId]/utils';
import { notFound } from 'next/navigation';
import { PageProps } from '@/app/page-props';
import { VStack } from '@chakra-ui/react';
import { Feed } from './components/Feed';
import { PostForm } from '@/lib/forms/PostForm/PostForm';
import { TeamHeader } from './components/TeamHeader';

const Page = async ({ params }: PageProps) => {
    const data = await getUserAndScopes();
    const spaceId = Number.parseInt(params['spaceId']);

    if (!data) {
        notFound();
    }

    if (!data?.scopes.some((scope) => scope.id === spaceId)) {
        notFound();
    }

    const currentSpace = data?.scopes.find((scope) => scope.id === spaceId);

    if (!currentSpace) {
        notFound();
    }

    return (
        <VStack width={['full', 'md', '2xl']} m="auto" spacing={5}>
            <TeamHeader scope={currentSpace} />
            <PostForm scope={currentSpace} />
            <Feed scopeId={spaceId} />
        </VStack>
    );
};

export default Page;
