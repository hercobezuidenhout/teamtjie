import { useMultiStyleConfig } from '@chakra-ui/system';
import {
  Avatar,
  BoxProps,
  HStack,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { AvatarStub } from '@/models';
import * as CSS from 'csstype';

interface AvatarTagProps extends BoxProps {
  avatar?: AvatarStub<string | number>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideLabel?: boolean;
}

export const AvatarTag = ({
  size,
  avatar,
  hideLabel,
  ...rest
}: AvatarTagProps) => {
  const styles = useMultiStyleConfig('AvatarTag', { size });
  const name = avatar?.name ?? 'John Doe';
  const avatarName = avatar?.name ?? '?';
  const isLoaded = !!avatar;

  return (
    <HStack
      maxW={styles.container['maxW'] as string | number}
      __css={styles.container}
      {...rest}
    >
      {hideLabel ? (
        <Tooltip label={name} borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text">
          <Avatar
            size={styles.avatar['size']}
            name={avatarName}
            src={avatar?.image ?? undefined}
          />
        </Tooltip>
      ) : (
        <>
          <Avatar
            size={styles.avatar['size']}
            name={avatarName}
            src={avatar?.image ?? undefined}
          />
          <Skeleton isLoaded={isLoaded} overflow="hidden">
            <Text
              fontSize={styles.label['fontSize'] as CSS.Property.FontSize}
              isTruncated
            >
              {name}
            </Text>
          </Skeleton>
        </>
      )}
    </HStack>
  );
};
