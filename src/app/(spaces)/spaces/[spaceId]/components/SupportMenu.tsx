import { getVersion } from '@/package';
import {
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  FaEnvelope
} from 'react-icons/fa6';
import { FiGitCommit, FiHelpCircle } from 'react-icons/fi';

export const SupportMenu = () => {
  const version = getVersion();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="md"
        aria-label="Options"
        icon={<FiHelpCircle />}
      />
      <MenuList>
        <MenuItem
          as={Link}
          href="mailto:herco.bezuidenhout@gmail.com?subject=Teamtjie Support"
          icon={<FaEnvelope />}
        >
          Email Support
        </MenuItem>
        <MenuDivider />
        <MenuItem
          as={Link}
          href="https://github.com/hercobezuidenhout/teamtjie/blob/main/CHANGELOG.md"
          icon={<FiGitCommit />}
        >
          v{version}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
