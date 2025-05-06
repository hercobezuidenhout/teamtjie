import { VStack } from '@chakra-ui/react';
import {
  PostCardBodyValues,
  PostCardBodyValuesProps,
} from './PostCardBodyValues';
import {
  PostCardBodyContent,
  PostCardBodyContentProps,
} from './PostCardBodyContent';
import { AvatarStub } from '@/models';

export interface PostCardBodyProps extends PostCardBodyValuesProps, Omit<PostCardBodyContentProps, 'issuedTo'> {
  issuedBy: AvatarStub<string>;
  issuedTo?: AvatarStub<string> | null;
}

export const PostCardBody = ({
  isSmall,
  values = [],
  issuedBy,
  issuedTo,
  ...props
}: PostCardBodyProps) => (
  <VStack align="stretch" gap="0">
    <PostCardBodyValues values={values} isSmall={isSmall} />
    {issuedTo ? (
      <PostCardBodyContent {...props} issuedTo={issuedTo} />
    ) : (
      <PostCardBodyContent {...props} issuedTo={issuedBy} />
    )}
  </VStack>
);
