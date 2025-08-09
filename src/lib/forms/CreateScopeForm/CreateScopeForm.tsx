'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { CreateScopeAvatarInput } from './CreateScopeAvatarInput';
import { FormInput } from '@/lib/inputs/FormInput/FormInput';
import { useRouter } from 'next/navigation';
import { getErrorDescription, getErrorMessage } from '@/utils/http-utils';
import {
  CreateScopePayload,
  useCreateScopeMutation,
} from '@/services/scope/mutations/use-create-scope-mutation';
import { useUploadAvatar } from '@/services/avatar/mutations/avatar-mutations';

interface CreateScopeFormProps {
  onCancel?: () => void;
  type: 'SPACE' | 'TEAM';
  spaceId?: number;
  onLogoutClick?: () => void;
  onSuccess?: () => void;
}

export const CreateScopeForm = ({
  onCancel,
  type,
  spaceId,
  onLogoutClick,
  onSuccess
}: CreateScopeFormProps) => {
  const formMethods = useForm<CreateScopePayload>();
  const { handleSubmit, reset, control } = formMethods;
  const { mutateAsync: createScope, isPending: isCreating } = useCreateScopeMutation();
  const { mutateAsync: uploadAvatar, isPending: isUploading } = useUploadAvatar('SCOPE');
  const toast = useToast();
  const { push } = useRouter();

  const isTeam = type == 'TEAM';

  const onSubmit = async (data: CreateScopePayload) => {
    const scope: CreateScopePayload = {
      ...data,
      parentScopeId: isTeam ? spaceId : undefined,
      type: type,
    };

    const TOAST_TITLE = 'Team Created';

    try {
      const response = await createScope(scope);

      if (!response) {
        return;
      }

      const newScopeId = response.id;

      const { avatar } = data;

      if (avatar) {
        await uploadAvatar({ id: response.id, avatar });
      }

      reset();

      toast({
        title: TOAST_TITLE,
        description: 'Your team has been successfully created.',
        variant: 'success',
        duration: 2000,
        icon: '🤘'
      });

      if (onSuccess) {
        onSuccess();
      }

      isTeam
        ? push(`/spaces/${spaceId}/teams/${newScopeId}`)
        : push(`/spaces/${newScopeId}`);
    } catch (error) {
      const errorMessage = getErrorMessage(error) ?? 'Something went wrong.';
      toast({
        title: errorMessage,
        status: 'error',
        description: getErrorDescription(error),
      });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Card as="form" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <Heading>Create your team</Heading>
          <Text color="chakra-subtle-text">
            Picture-perfect team in the making! Add your team logo and name to get started.
          </Text>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <CreateScopeAvatarInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormInput
                name="name"
                placeholder={`Team name`}
                required
                min={5}
                max={50}
              />
            </HStack>
            <FormInput
              name="description"
              placeholder={`Team description...`}
              required
              min={5}
              max={200}
              multiLine
            />
          </VStack>
        </CardBody>
        <CardFooter as={HStack} justify={onLogoutClick ? 'space-between' : 'flex-end'}>
          {onLogoutClick && (
            <Button mr={5} variant="link" onClick={onLogoutClick}>Logout</Button>
          )}
          <HStack justifyContent={onLogoutClick ? 'space-between' : 'flex-end'}>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button isLoading={isCreating || isUploading} variant="primary" type="submit">
              Create Team
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    </FormProvider>
  );
};
