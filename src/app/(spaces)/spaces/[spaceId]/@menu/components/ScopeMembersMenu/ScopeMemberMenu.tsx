import { ICONS } from '@/lib/icons/icons';
import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

export const ScopeMemberMenu = () => {
  return (
    <Menu size="sm">
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Icon as={ICONS.MoreIcon} />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem
          icon={<Icon as={ICONS.DeleteIcon} />}
          color="chakra-active-text"
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
