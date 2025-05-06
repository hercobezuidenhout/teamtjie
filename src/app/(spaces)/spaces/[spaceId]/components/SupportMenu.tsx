import {
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  FaEnvelope,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'
import { FiHelpCircle } from 'react-icons/fi'

export const SupportMenu = () => {
  //TODO: Simplify with {menuItems.map()}, add external link icons
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
          href="mailto:support@teamtjie.app?subject=<Add your subject here>"
          icon={<FaEnvelope />}
        >
          Email Support
        </MenuItem>
        <MenuDivider />
      </MenuList>
    </Menu>
  )
}
