import { HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface PostCardFooterProps {
  renderFooterLeft: ReactNode;
  renderFooterRight?: ReactNode;
}

export const PostCardFooter = ({
  renderFooterLeft,
  renderFooterRight,
}: PostCardFooterProps) => (
  <HStack justifyContent="space-between" alignItems="center">
    {renderFooterLeft}
    {renderFooterRight && renderFooterRight}
  </HStack>
);
