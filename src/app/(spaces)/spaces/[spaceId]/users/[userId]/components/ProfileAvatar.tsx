'use client';

import {
  Avatar,
  Card,
  Fade,
  Icon,
  IconButton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { ICONS } from '@/lib/icons/icons';
import { useRef } from 'react';
import { useAbility } from '@casl/react';
import { AbilityContext } from '@/contexts/AbilityContextProvider';
import { useHover } from 'react-use';
import { AvatarStub } from '@/models';
import { UpdateAvatarModal } from '@/lib/modals/UpdateAvatarModal/UpdateAvatarModal';
import { useModal } from '@/lib/hooks/useModal';

export interface ProfileAvatarProps<
  TId extends number | string,
  T extends AvatarStub<TId>,
> {
  profile?: T;
  profileType: 'USER' | 'SCOPE';
}

export const ProfileAvatar = <
  TId extends number | string,
  T extends AvatarStub<TId>,
>({
  profile,
  profileType,
}: ProfileAvatarProps<TId, T>) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [Modal, { showModal }] = useModal(UpdateAvatarModal);
  const ability = useAbility(AbilityContext);
  const canEdit = ability.can('edit', profile);

  const editIcon = (hovered: boolean) =>
    profile ? (
      <Avatar
        name={profile.name}
        size="lg"
        src={profile.image ?? undefined}
        ref={ref}
      >
        <Fade in={hovered && canEdit}>
          <IconButton
            aria-label="Edit profile image"
            position="absolute"
            variant="primary"
            size="xs"
            top="0"
            right="0"
            icon={<Icon as={ICONS.EditIcon} />}
            onClick={showModal}
          />
        </Fade>
      </Avatar>
    ) : (
      <></>
    );

  const [hoverableAvatar] = useHover(editIcon);

  return profile ? (
    <>
      {hoverableAvatar}
      {canEdit && <Modal profileId={profile.id} profileType={profileType} />}
    </>
  ) : (
    <Card borderRadius="50%">
      <SkeletonCircle size="24" />
    </Card>
  );
};
