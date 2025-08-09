import {
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react';
import { AutoCompleteSubComponentProps } from './types';
import { FiSearch, FiX } from 'react-icons/fi';

interface AutoCompleteInputProps<T> extends AutoCompleteSubComponentProps<T> {
  label?: string;
  placeholder: string;
  selectedItem: T | undefined;
  singleValue: boolean;
}

export const AutoCompleteInput = <T,>({
  getDropdownProps,
  getInputProps,
  getSelectedItemProps,
  getId,
  isOpen,
  label,
  placeholder,
  removeSelectedItem,
  selectedItem,
  template,
}: AutoCompleteInputProps<T>) => {

  const handleRemoveClick = () => {
    if (selectedItem) {
      removeSelectedItem(selectedItem);
    }
  };

  return (
    <VStack alignItems="stretch" width="full">
      <Heading size="sm">{label}</Heading>
      {selectedItem ? (
        <HStack key={getId(selectedItem)} spacing={1} {...getSelectedItemProps({ selectedItem: selectedItem })} justifyContent="space-between" _hover={{
          cursor: "pointer",
          backgroundColor: "chakra-subtle-bg"
        }} paddingY={3} paddingX={2} borderRadius="lg" onClick={handleRemoveClick}>
          {template(selectedItem)}
          <IconButton icon={<Icon as={FiX} />} size="md" variant="ghost" aria-label='Select user' color="chakra-subtle-text" onClick={handleRemoveClick} />
        </HStack>
      ) : (
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <Icon as={FiSearch} fontSize="sm" color="#C8C8C8" />
          </InputLeftElement>
          <Input placeholder={placeholder} borderColor="chakra-subtle-bg" _placeholder={{
            fontWeight: "bold",
            color: "#C8C8C8"
          }} backgroundColor="chakra-body-bg" borderRadius="lg"  {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))} />
        </InputGroup>
      )}
    </VStack>
  );
};
