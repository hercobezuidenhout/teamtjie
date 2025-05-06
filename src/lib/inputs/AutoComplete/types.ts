import {
  UseComboboxReturnValue,
  UseMultipleSelectionReturnValue,
} from 'downshift';
import { ReactNode } from 'react';

export interface AutoCompleteSubComponentProps<T>
  extends Pick<
      UseMultipleSelectionReturnValue<T>,
      'getSelectedItemProps' | 'getDropdownProps' | 'removeSelectedItem'
    >,
    Pick<
      UseComboboxReturnValue<T>,
      | 'isOpen'
      | 'getToggleButtonProps'
      | 'getLabelProps'
      | 'getMenuProps'
      | 'getInputProps'
      | 'highlightedIndex'
      | 'getItemProps'
    > {
  getId: (value: T) => string | number;
  template: (value: T) => ReactNode;
}
