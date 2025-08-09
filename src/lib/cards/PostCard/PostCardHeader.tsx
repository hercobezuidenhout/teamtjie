import { HStack, Text } from '@chakra-ui/react';
import {
  PostCardHeaderScopeProps,
  PostCardHeaderScope,
} from './PostCardHeaderScope';
import {
  PostCardHeaderAuthor,
  PostCardHeaderAuthorProps,
} from './PostCardHeaderAuthor';
import {
  PostCardHeaderDate,
  PostCardHeaderDateProps,
} from './PostCardHeaderDate';
import { Can } from '@/lib/casl/Can';
import { subject } from '@casl/ability';
import { PostType } from '@prisma/client';

export interface PostCardHeaderProps
  extends PostCardHeaderScopeProps,
  PostCardHeaderAuthorProps,
  PostCardHeaderDateProps {
  scopeId: number;
  postType: PostType;
}

export const PostCardHeader = ({
  scopeId,
  postType,
  ...rest
}: PostCardHeaderProps) => (
  <HStack>
    <PostCardHeaderScope {...rest} />
    <Can I='view_author' this={subject('Post', { scopeId: scopeId, type: postType })}>
      <Text>•</Text>
      <PostCardHeaderAuthor {...rest} />
    </Can>
    <Text>•</Text>
    <PostCardHeaderDate {...rest} />
  </HStack>
);
