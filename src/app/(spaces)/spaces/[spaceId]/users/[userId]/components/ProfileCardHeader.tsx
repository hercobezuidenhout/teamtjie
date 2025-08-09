import { HStack, Skeleton, Spacer, VStack } from '@chakra-ui/react';
import {
  ProfileAvatar,
  ProfileAvatarProps,
} from '@/app/(spaces)/spaces/[spaceId]/users/[userId]/components/ProfileAvatar';
import { UserName } from '@/app/(spaces)/spaces/[spaceId]/users/[userId]/components/UserName';
import { ReactNode } from 'react';
import { AvatarStub } from '@/models';

interface ProfileCardHeaderProps<
  TId extends number | string,
  T extends AvatarStub<TId>,
> extends Pick<ProfileAvatarProps<TId, T>, 'profile' | 'profileType'> {
  isEditing: boolean;
  isLoaded: boolean;
  menu?: ReactNode;
}

export const ProfileCardHeader = <
  TId extends number | string,
  T extends AvatarStub<TId>,
>({
  isEditing,
  isLoaded,
  menu,
  profile,
  profileType,
}: ProfileCardHeaderProps<TId, T>) => {
  return (
    <HStack align="flex-start">
      <ProfileAvatar profile={profile} profileType={profileType} />
      <VStack align="flex-start" spacing={0}>
        <Skeleton isLoaded={isLoaded}>
          <UserName isEditing={isEditing} />
        </Skeleton>
      </VStack>
      <Spacer />
      {menu}
    </HStack>
  );
};
