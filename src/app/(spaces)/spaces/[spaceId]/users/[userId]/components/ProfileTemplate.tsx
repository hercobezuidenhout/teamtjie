'use client';

import { ProfileMenu } from './ProfileMenu';
import {
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { useUserQuery } from '@/services/user/queries/use-user-query';
import { useUpdateUserMutation } from '@/services/user/mutations/use-update-user-mutation';
import { ProfileCard } from './ProfileCard';

export interface ProfileTemplateProps {
  userId: string;
}

export const ProfileTemplate = ({
  userId,
}: ProfileTemplateProps) => {
  const { data: user } = useUserQuery(userId);
  const { mutateAsync } = useUpdateUserMutation();
  const [isEditing, { toggle: toggleIsEditing, off: stopEditing }] =
    useBoolean(false);
  const dateValue = user ? new Date(user.createdAt) : new Date();

  const handleUpdate = async (payload) => {
    await mutateAsync(payload);
  };

  return (
    <VStack align="stretch">
      <ProfileCard
        dateValue={dateValue}
        dateLabel="Joined"
        descriptionName="aboutMe"
        fallbackDescription="Tell your team more about yourself..."
        fineCount={0}
        isEditing={isEditing}
        onCancelEditing={stopEditing}
        onUpdate={handleUpdate}
        profile={user}
        profileType="USER"
        menu={
          <ProfileMenu
            user={user}
            onEditClick={toggleIsEditing}
          />
        }
      />
    </VStack>
  );
};
