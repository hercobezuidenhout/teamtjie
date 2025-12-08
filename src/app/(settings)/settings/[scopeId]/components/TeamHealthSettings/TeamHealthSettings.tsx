'use client';

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { Scope } from '@prisma/client';
import { SettingsTemplate } from '@/lib/templates/SettingsTemplate/SettingsTemplate';
import { useScopeSettingsQuery } from '@/services/sentiment/queries/use-scope-settings-query';
import { useUpdateScopeSettingsMutation } from '@/services/sentiment/mutations/use-update-scope-settings-mutation';
import { Can } from '@/lib/casl/Can';
import { subject } from '@casl/ability';

interface TeamHealthSettingsProps {
  scope: Scope;
}

export const TeamHealthSettings = ({ scope }: TeamHealthSettingsProps) => {
  const toast = useToast();
  const { data: settings, isLoading } = useScopeSettingsQuery({ scopeId: scope.id });
  const updateMutation = useUpdateScopeSettingsMutation();

  const handleToggle = async () => {
    try {
      await updateMutation.mutateAsync({
        scopeId: scope.id,
        showAverageSentiment: !settings?.showAverageSentiment,
      });

      toast({
        title: 'Settings updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Can I="edit" this={subject('Scope', { id: scope.id })}>
      <SettingsTemplate title="Team Health">
        <FormControl>
          <FormLabel>Show Average Sentiment to Members</FormLabel>
          <Switch
            isChecked={settings?.showAverageSentiment || false}
            onChange={handleToggle}
            isDisabled={isLoading || updateMutation.isPending}
          />
          <FormHelperText>
            When enabled, all team members can see the team&apos;s average daily sentiment.
            When disabled, only admins can view the average.
          </FormHelperText>
        </FormControl>
      </SettingsTemplate>
    </Can>
  );
};
