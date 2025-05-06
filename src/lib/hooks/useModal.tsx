import { ModalProps as ChakraModalProps, useBoolean } from '@chakra-ui/react';
import { useMemo } from 'react';

export type ModalProps = Pick<ChakraModalProps, 'isOpen' | 'onClose'>;

type ModalComponent<T extends ModalProps> = (props: T) => JSX.Element;

export type ModalValue<T extends ModalProps> = [
  (props: Omit<T, 'isOpen' | 'onClose'>) => JSX.Element,
  {
    showModal: () => void;
    dismissModal: () => void;
  },
];

export const useModal = <T extends ModalProps>(
  Component: ModalComponent<T>,
  initialValue = false
): ModalValue<T> => {
  const [isOpen, { on: showModal, off: dismissModal }] =
    useBoolean(initialValue);

  const WrappedModal = useMemo(() => {
    const component = (props: Omit<T, 'isOpen' | 'onClose'>) => {
      const fullProps = { ...props, isOpen, onClose: dismissModal } as T;
      return <Component {...fullProps} />;
    };

    component.displayName = 'WrappedModal';

    return component;
  }, [Component, dismissModal, isOpen]);

  return [
    WrappedModal,
    {
      showModal,
      dismissModal,
    },
  ];
};
