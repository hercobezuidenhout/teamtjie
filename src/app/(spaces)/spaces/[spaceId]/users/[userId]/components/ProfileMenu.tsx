import { Can } from '@/lib/casl/Can';
import { ICONS } from '@/lib/icons/icons';
import { Icon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { IconButton, useToast } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { usePathname } from 'next/navigation';

interface ProfileMenuProps {
  user?: User;
  onEditClick?: () => void;
}

export const ProfileMenu = ({
  user,
  onEditClick
}: ProfileMenuProps) => {
  const pathname = usePathname();
  const toast = useToast();

  const handleShareClick = async () => {
    await navigator.clipboard.writeText(
      //TODO: Replace this variable with headers().get("host")?
      `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`
    );

    toast({
      status: 'success',
      title: 'The link has been copied!',
    });
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<Icon as={ICONS.MoreIcon} />}
          variant="ghost"
        />
        <MenuList>
          <Can I="edit" this={user}>
            <MenuItem
              icon={<Icon as={ICONS.EditIcon} fontSize="lg" />}
              onClick={onEditClick}
            >
              Edit Profile
            </MenuItem>
          </Can>
          <MenuItem
            icon={<Icon as={ICONS.ShareIcon} fontSize="lg" />}
            onClick={handleShareClick}
          >
            Share Profile
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
