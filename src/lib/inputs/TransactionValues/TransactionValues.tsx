import { ICONS } from '@/lib/icons/icons';
import { Button, Icon, VStack } from '@chakra-ui/react';
import { ScopeValue } from '@prisma/client';
import {
  Controller as FormController,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';
import { ScopeValueAutoComplete } from '../ScopeValueAutoComplete/ScopeValueAutoComplete';

export interface TransactionValuesProps<TPayload extends FieldValues> {
  values: ScopeValue[];
  toggle: () => void;
  isLinkedToValues?: boolean;
  name: Path<TPayload>;
}

export const TransactionValues = <TPayload extends FieldValues>({
  values,
  toggle,
  isLinkedToValues = false,
  name,
}: TransactionValuesProps<TPayload>) => {
  const { control } = useFormContext();
  return (
    <VStack align="stretch">
      <Button
        my={2}
        alignSelf="flex-end"
        color="chakra-subtle-text"
        size="sm"
        onClick={toggle}
        variant="link"
        rightIcon={
          <Icon
            fontSize="lg"
            as={isLinkedToValues ? ICONS.MinusCircleIcon : ICONS.PlusCircleIcon}
          />
        }
      >
        {isLinkedToValues ? 'Remove Values' : 'Link to Values'}
      </Button>
      {isLinkedToValues && (
        <FormController
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <ScopeValueAutoComplete
                value={value}
                onChange={onChange}
                options={values}
              />
            );
          }}
        />
      )}
    </VStack>
  );
};
