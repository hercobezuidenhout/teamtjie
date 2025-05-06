import { ICONS } from '@/lib/icons/icons';
import { Icon, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';

interface MembersSearchBarProps {
  filter?: string;
  setFilter: (filter: string) => void;
}

export const MembersSearchBar = ({
  filter,
  setFilter,
}: MembersSearchBarProps) => (
  <InputGroup display="flex" mb={5}>
    <InputLeftElement w={8}>
      <Icon as={ICONS.SearchIcon} color="chakra-subtle-text" />
    </InputLeftElement>
    <Input
      backgroundColor="chakra-body-bg"
      placeholder="Search profiles"
      value={filter}
      size="md"
      onChange={(event) => setFilter(event.target.value)}
      border="1px solid gray"
    />
  </InputGroup>
);
