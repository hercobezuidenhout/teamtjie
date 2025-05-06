'use client';

import { useBoolean, useBreakpointValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';

interface MenuContextValue {
  isOpen: boolean;
  showButton: boolean;
  toggle: () => void;
}

const MenuContext = createContext<MenuContextValue>({
  isOpen: false,
  showButton: false,
  toggle: () => {
    throw new Error('Context not initialized');
  },
});

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const [isOpen, { toggle, off }] = useBoolean(false);
  const isSmallScreen = !!useBreakpointValue({ base: true, md: false });
  const showButton = isSmallScreen;

  // Hide the menu when transitioning to a larger screen
  useEffect(() => {
    if (!isSmallScreen) {
      off();
    }
  }, [isSmallScreen, off]);

  // Hide the menu when navigating to a different page
  useEffect(() => {
    off();
  }, [pathname, off]);

  return (
    <MenuContext.Provider value={{ isOpen, showButton, toggle }}>
      {children}
    </MenuContext.Provider>
  );
};
