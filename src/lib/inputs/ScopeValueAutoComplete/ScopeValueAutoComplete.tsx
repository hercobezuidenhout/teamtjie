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
    <VStack align="stretch" spacing={3} width="full">
      {options.map(({ id, name }, index) => (
        <FormControl key={id} as={HStack} align="center">
          <FormLabel htmlFor={`value-${id}`} mb={0} cursor="pointer">
            <HStack spacing={3}>
              <Tag borderRadius="full" variant="primary" size="sm">
                {++index}
              </Tag>
              <Text fontSize="sm">{name}</Text>
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
