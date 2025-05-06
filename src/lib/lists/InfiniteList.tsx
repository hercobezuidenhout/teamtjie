'use client';

import { ICONS } from '@/lib/icons/icons';
import { Box, Button, Divider, Icon, StackProps, VStack } from '@chakra-ui/react';
import * as R from 'ramda';
import { Fragment, useRef } from 'react';

export interface InfiniteListProps<T extends { id: number | string; }>
  extends Pick<StackProps, 'spacing'> {
  data?: T[];
  count?: number;
  onNextPage: () => void;
  isLoading: boolean;
  itemTemplate: (item: T, index: number) => JSX.Element;
  showDivider?: boolean;
  skeletonTemplate: (index: number) => JSX.Element;
  skeletonCount?: number;
}

export const InfiniteList = <T extends { id: number | string; }>({
  data = [],
  count = 0,
  onNextPage,
  isLoading,
  itemTemplate,
  showDivider,
  skeletonTemplate,
  skeletonCount = 1,
  spacing,
}: InfiniteListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMore = data.length < count;

  return (
    <VStack
      alignItems="stretch"
      spacing={spacing}
      ref={containerRef}
      width="full"
    >
      {data.map((item, index) => {
        const ItemTemplate = () => itemTemplate(item, index);
        return (
          <Box key={item.id}>
            <ItemTemplate key={item.id} />
            {showDivider && <Divider variant="gradient" />}
          </Box>
        );
      })}
      {isLoading && (
        <VStack alignItems="stretch">
          {R.times(R.identity, isLoading ? 2 : skeletonCount).map((index) => {
            const SkeletonTemplate = () => skeletonTemplate(index);
            return (
              <Fragment key={index}>
                <SkeletonTemplate key={index} />
                {showDivider && <Divider />}
              </Fragment>
            );
          })}
        </VStack>
      )}
      {hasMore && (
        <Button onClick={onNextPage} leftIcon={<Icon as={ICONS.ArrowDownIcon} />} isLoading={isLoading} variant="ghost">Load More ...</Button>
      )}
    </VStack>
  );
};
