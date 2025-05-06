import { useUserSearch } from '@/lib/hooks/useUserSearch';
import { useEffect, useState } from 'react';
import { User } from '@prisma/client';
import * as R from 'ramda';
import { Scope } from '@/models';
import { UserTemplate } from './UserTemplate';
import { AutoComplete } from '@/lib/inputs/AutoComplete/AutoComplete';
import { UserSelectedTemplate } from './UserSelectedTemplate';

interface UserAutoCompleteProps extends Scope {
  value: string[] | undefined;
  singleValue?: boolean;
  onChange: (value: string[] | undefined) => void;
}

const getId = R.prop<string>('id');
const getLabel = R.prop<string>('name');

export const UserAutoComplete = ({
  scopeType,
  scopeId,
  value,
  onChange,
  singleValue = false,
}: UserAutoCompleteProps) => {
  const [inputValue, setInputValue, { userOptions: items, isLoading }] =
    useUserSearch(scopeType, scopeId);
  const [cachedItems, setCachedItems] = useState<User[]>([]);

  // The cachedItems collection saves all the items we have queried
  // But it needs to be cleared when we select a different scope
  useEffect(() => {
    setCachedItems([]);
  }, [scopeType, scopeId]);

  // This is where we add the items
  // The hook needs to be below the hook that clears things to prevent the cache from being cleared at first render
  useEffect(() => {
    setCachedItems((previousItems) =>
      R.uniqBy(getId, [...(previousItems ?? []), ...items])
    );
  }, [items]);

  const selectedItems = !value
    ? []
    : cachedItems.filter((item) => value.includes(getId(item)));

  const handleChange = (items: User[] | undefined) => {
    onChange(items?.map((item) => item.id));
  };

  return (
    <AutoComplete
      singleValue={singleValue}
      inputValue={inputValue}
      items={items}
      value={selectedItems}
      onChange={handleChange}
      onInputChange={setInputValue}
      isLoading={isLoading}
      getId={getId}
      getLabel={getLabel}
      placeholder="Select a team member"
      template={UserTemplate}
      selectedTemplate={UserSelectedTemplate}
      label='WHO'
    />
  );
};
