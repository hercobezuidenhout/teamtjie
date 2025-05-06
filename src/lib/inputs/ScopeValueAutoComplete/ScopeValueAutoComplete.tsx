import React from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Spacer,
  Switch,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import * as R from 'ramda';
import { ScopeValue } from '@prisma/client';

interface ScopeValueAutoCompleteProps {
  value: number[] | undefined;
  options: ScopeValue[];
  onChange: (value: number[] | undefined) => void;
}

export const ScopeValueAutoComplete = ({
  options,
  value = [],
  onChange,
}: ScopeValueAutoCompleteProps) => {
  const handleChange = (id: number, isToggled: boolean) => {
    const newValue = isToggled
      ? R.union(value, [id])
      : R.difference(value, [id]);

    onChange(newValue);
  };

  return (
    <VStack align="flex-start">
      {options.map(({ id, name }, index) => (
        <FormControl key={id} as={HStack} align="center">
          <FormLabel htmlFor={`value-${id}`}>
            <HStack>
              <Tag borderRadius="full" variant="primary">
                {++index}
              </Tag>
              <Text>{name}</Text>
            </HStack>
          </FormLabel>
          <Spacer />
          <Switch
            id={`value-${id}`}
            key={id}
            isChecked={value?.includes(id)}
            onChange={(e) => handleChange(id, e.target.checked)}
            colorScheme="primary"
          />
        </FormControl>
      ))}
    </VStack>
  );
};
