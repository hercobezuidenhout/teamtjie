import { Card, ListItem, Spinner, UnorderedList } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { AutoCompleteSubComponentProps } from './types';

interface OptionListProps<T> extends AutoCompleteSubComponentProps<T> {
  isLoading?: boolean;
  items: T[];
  template: (value: T) => ReactNode;
}

export const OptionList = <T,>({
  isOpen,
  getMenuProps,
  getItemProps,
  getId,
  isLoading,
  items,
  template,
}: OptionListProps<T>) => {
  return (
    <Card
      variant="elevated"
      data-testid="menu"
      as={UnorderedList}
      position="absolute"
      listStyleType="none"
      p={2}
      zIndex={1000}
      visibility={isOpen ? 'visible' : 'hidden'}
      maxH="md"
      minW="xs"
      m={0}
      overflow="auto"
      {...getMenuProps()}
      spacing={1}
    >
      {isLoading && (
        <ListItem textAlign="center">
          <Spinner />
        </ListItem>
      )}
      {isOpen &&
        items.map((item, index) => (
          <ListItem
            cursor="pointer"
            key={getId(item)}
            {...getItemProps({ item, index })}
          >
            {template(item)}
          </ListItem>
        ))}
    </Card>
  );
};
