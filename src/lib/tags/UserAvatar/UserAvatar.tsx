import { HStack } from '@chakra-ui/react';
import { AvatarStub } from '@/models';
import { AvatarTag } from '@/lib/tags/AvatarTag/AvatarTag';

export interface UserAvatarProps extends AvatarStub<string> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideLabel?: boolean;
}

export const UserAvatar = ({
  name,
  image,
  id,
  size = 'md',
  hideLabel,
}: UserAvatarProps) => {
  return (
    <HStack>
      <AvatarTag
        hideLabel={hideLabel}
        avatar={{ id, name, image }}
        size={size}
      />
    </HStack>
  );
};
