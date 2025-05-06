import { Avatar, HStack, Heading } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useAbilities } from '@/contexts/AbilityContextProvider';
import { useScopes } from '@/contexts/ScopeProvider';
import * as R from 'ramda';
import { AutoComplete } from '@/lib/inputs/AutoComplete/AutoComplete';
import { GetScopeValueDto } from '@/prisma';
import { AnyAbility, subject } from '@casl/ability';
import { Scope } from '@prisma/client';

interface ScopeSelectProps {
  label: string | undefined;
  value: Scope | undefined;
  onChange: (value: Scope | undefined) => void;
}

const getKey = (item: GetScopeValueDto | null) =>
  item ? `${item.type}-${item.id}` : '';
const getLabel = R.prop<string>('name');

const containsCaseInsensitive = (targetString) =>
  R.pipe(R.toLower, R.includes(R.toLower(targetString)));

const flattenScopes = (
  scopes: GetScopeValueDto[],
  currentSpaceId: number,
  abilities: AnyAbility
): GetScopeValueDto[] => {
  const space = scopes.find((scope) => scope.id === currentSpaceId);

  if (!space) {
    return [];
  }

  const filteredScopes = scopes.filter(
    (scope) => scope.parentScopeId === currentSpaceId
  );

  if (abilities.can('read', subject('Scope', { id: currentSpaceId }))) {
    return [space, ...filteredScopes];
  } else {
    return filteredScopes;
  }
};

export const ScopeSelect = ({ label, value, onChange }: ScopeSelectProps) => {
  const abilities = useAbilities();
  const { scopes, current } = useScopes();

  const items: GetScopeValueDto[] = useMemo(
    () => flattenScopes(scopes, current.space.id, abilities),
    [scopes, current, abilities]
  );

  const [inputValue, setInputValue] = useState<string>();

  const filteredItems = items.filter(
    (item) => !inputValue || containsCaseInsensitive(inputValue)(item.name)
  );

  const selectedItems = items.filter((item) => item.id === value?.id);

  const handleChange = (items: GetScopeValueDto[] = []) => {
    const item = items ? items[0] : undefined;
    onChange(item ?? undefined);
  };

  return (
    <AutoComplete
      label={label}
      inputValue={inputValue}
      items={filteredItems}
      value={selectedItems}
      onChange={handleChange}
      onInputChange={setInputValue}
      getId={getKey}
      getLabel={getLabel}
      placeholder="Select your team"
      template={(item) => (
        <HStack>
          <Avatar size="sm" src={item.image ? item.image : undefined} name={item.name} />
          <Heading>{item.name}</Heading>
        </HStack>
      )}
    />
  );
};
