import { useCombobox, useMultipleSelection } from 'downshift';
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { OptionList } from './OptionList';
import { AutoCompleteInput } from './AutoCompleteInput';

interface AutoCompleteProps<T> {
  items: T[] | undefined;
  isLoading?: boolean;
  inputValue: string | undefined;
  onInputChange: (value: string | undefined) => void;
  label?: string;
  value: T[] | undefined;
  onChange: (value: T[] | undefined) => void;
  placeholder: string;
  getId: (value: T) => string | number;
  getLabel: (value: T) => string;
  selectedTemplate?: (value: T) => ReactNode;
  template: (value: T) => ReactNode;
  singleValue?: boolean;
}

export const AutoComplete = <T,>({
  items = [],
  isLoading,
  label,
  onInputChange,
  value: selectedItems = [],
  onChange,
  getId,
  getLabel,
  placeholder,
  template,
  singleValue = false,
  selectedTemplate,
}: AutoCompleteProps<T>) => {
  const selectProps = useMultipleSelection<T>({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          onChange(newSelectedItems ?? []);
          break;
        default:
          break;
      }
    },
  });

  const comboBoxProps = useCombobox<T>({
    items,
    itemToString(item) {
      return item ? getLabel(item) : '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(_, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: false, // close the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
            inputValue: undefined,
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      if (
        newSelectedItem &&
        selectedItems.some(
          (selectedItem) => getId(selectedItem) === getId(newSelectedItem)
        )
      ) {
        return;
      }

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            onChange(
              singleValue
                ? [newSelectedItem]
                : [...selectedItems, newSelectedItem]
            );
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          onInputChange(newInputValue);

          break;
        default:
          break;
      }
    },
  });

  return (
    <Box>
      <AutoCompleteInput
        {...comboBoxProps}
        {...selectProps}
        getId={getId}
        label={label}
        placeholder={placeholder}
        singleValue={singleValue}
        selectedItem={selectedItems[0]}
        template={selectedTemplate ? selectedTemplate : template}
      />
      <OptionList
        {...comboBoxProps}
        {...selectProps}
        getId={getId}
        isLoading={isLoading}
        items={items}
        template={template}
      />
    </Box>
  );
};
