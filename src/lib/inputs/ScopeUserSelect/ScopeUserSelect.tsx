import { Scope } from '@/models';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import {
  Controller as FormController,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';
import { UserAutoComplete } from '../UserAutoComplete/UserAutoComplete';

export interface ScopeUserSelectProps<TPayload extends FieldValues> {
  name: Path<TPayload>;
  selectedScope: Scope;
}

export const ScopeUserSelect = <TPayload extends FieldValues>({
  name,
  selectedScope,
}: ScopeUserSelectProps<TPayload>) => {
  const { control } = useFormContext();

  return (
    <FormController
      name={name}
      control={control}
      rules={{
        validate: {
          notEmpty: (value) =>
            !value || value.length === 0
              ? 'Select at least one user to fine'
              : undefined,
        },
      }}
      render={({
        field: { value, onChange },
        fieldState: { invalid, error },
      }) => {
        return (
          <FormControl isInvalid={invalid}>
            <UserAutoComplete
              onChange={onChange}
              scopeId={selectedScope.scopeId}
              scopeType={selectedScope.scopeType}
              value={value}
            />
            {error && (
              <FormErrorMessage>{error.message || 'Invalid'}</FormErrorMessage>
            )}
          </FormControl>
        );
      }}
    />
  );
};
