import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { ProfileDescription } from './ProfileDescription';
import { FormProvider, useForm } from 'react-hook-form';
import { ReactNode, useEffect } from 'react';
import { DirtyFormModal } from '@/lib/modals/DirtyFormModal/DirtyFormModal';
import { AvatarStub } from '@/models';
import { ProfileCardFooter } from './ProfileCardFooter';
import { ProfileCardHeader } from './ProfileCardHeader';
import { ProfileAvatarProps } from './ProfileAvatar';
import { getErrorMessage } from '@/utils/http-utils';

interface ProfileCardProps<
  TId extends number | string,
  T extends AvatarStub<TId>,
> extends Pick<ProfileAvatarProps<TId, T>, 'profile' | 'profileType'> {
  dateLabel?: 'Created' | 'Joined';
  dateValue: Date;
  descriptionName: string;
  fallbackDescription?: string;
  fineCount: number;
  isEditing: boolean;
  menu?: ReactNode;
  onUpdate: (payload: T) => Promise<void>;
  onCancelEditing: () => void;
}

export const ProfileCard = <
  TId extends number | string,
  T extends AvatarStub<TId>,
>({
  dateLabel = 'Created',
  dateValue,
  descriptionName,
  fallbackDescription,
  isEditing,
  onCancelEditing,
  onUpdate,
  menu,
  profile,
  profileType,
}: ProfileCardProps<TId, T>) => {
  const form = useForm<T>();
  const toast = useToast();
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;
  const isLoaded = !!profile;

  useEffect(() => {
    reset(profile);
  }, [reset, profile]);

  useEffect(onCancelEditing, [onCancelEditing, profile]);

  const onSubmit = async (payload: T) => {
    try {
      await onUpdate(payload);
      reset(payload);
      onCancelEditing();
      toast({
        status: 'success',
        title: 'Profile updated',
      });
    } catch (error) {
      const errorMessage =
        getErrorMessage(error) ??
        "We couldn't update your profile. Please try again later.";
      toast({
        status: 'error',
        title: 'Failed to Update Profile',
        description: errorMessage,
      });
    }
  };

  const onCancel = () => {
    onCancelEditing();
    reset(profile);
  };

  return (
    <FormProvider {...form}>
      <Box pt="7" as="form" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <ProfileCardHeader
              isEditing={isEditing}
              isLoaded={isLoaded}
              menu={menu}
              profile={profile}
              profileType={profileType}
            />
          </CardHeader>
          <CardBody py={0}>
            <Skeleton isLoaded={isLoaded}>
              <ProfileDescription
                descriptionName={descriptionName}
                fallbackDescription={fallbackDescription}
                isEditing={isEditing}
              />
            </Skeleton>
          </CardBody>
          <CardFooter>
            <ProfileCardFooter
              BusyButton={Button}
              dateLabel={dateLabel}
              dateValue={dateValue}
              isDirty={isDirty}
              isEditing={isEditing}
              onCancelClick={onCancel}
            />
          </CardFooter>
        </Card>
        <DirtyFormModal />
      </Box>
    </FormProvider>
  );
};
