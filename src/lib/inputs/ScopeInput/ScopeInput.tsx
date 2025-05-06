import {
  Controller as FormController,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { ScopeSelect } from '@/lib/inputs/ScopeSelect/ScopeSelect';

interface ScopeInputProps<TPayload extends FieldValues> {
  name: Path<TPayload>;
}

export const ScopeInput = <TPayload extends FieldValues>({
  name,
}: ScopeInputProps<TPayload>) => {
  const { control } = useFormContext<TPayload>();

  return (
    <FormController
      name={name}
      control={control}
      rules={{
        validate: {
          notEmpty: (value) => (!value ? 'Required' : undefined),
        },
      }}
      render={({
        field: { value, onChange },
        fieldState: { invalid, error },
      }) => (
        <FormControl isInvalid={invalid}>
          <ScopeSelect value={value} onChange={onChange} label="WHERE" />
          {error && (
            <FormErrorMessage>{error.message || 'Invalid'}</FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
};
