'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import produce from 'immer';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
  useRef,
} from 'react';

type DialogCategory = 'information' | 'warning' | 'error';

type DialogOptions = {
  category?: DialogCategory;
  cancelLabel?: string | 'none';
  confirmLabel?: string;
};

type DialogContent = {
  title: string;
  message: string;
  callback?: () => void;
};

interface DialogContextState {
  isOpen: boolean;
  content?: DialogContent;
  options: DialogOptions;
}

const DefaultOptions: DialogOptions = {
  category: 'information',
  cancelLabel: 'Cancel',
  confirmLabel: 'Okay',
};

interface DialogContextValue {
  dismiss: () => void;
  notify: (content: DialogContent, options?: DialogOptions) => void;
}

type DialogAction =
  | { type: 'dismiss' }
  | {
      type: 'notify';
      content: DialogContent;
      options?: DialogOptions;
    };

const DialogReducer = (
  state: DialogContextState,
  action: DialogAction
): DialogContextState =>
  produce(state, (draft) => {
    switch (action.type) {
      case 'dismiss':
        draft.isOpen = false;
        draft.content = undefined;
        draft.options = DefaultOptions;
        return;
      case 'notify':
        draft.isOpen = true;
        draft.content = action.content;
        draft.options = { ...DefaultOptions, ...action.options };
        return;
    }
  });

const throwNotInitializedError = () => {
  throw new Error('The context is not initialized');
};

const DialogContext = createContext<DialogContextValue>({
  dismiss: throwNotInitializedError,
  notify: throwNotInitializedError,
});

export const DialogProvider = ({ children }: PropsWithChildren) => {
  const [
    {
      isOpen,
      content,
      options: { cancelLabel, confirmLabel },
    },
    dispatch,
  ] = useReducer(DialogReducer, {
    isOpen: false,
    options: DefaultOptions,
  });
  const cancelRef = useRef<HTMLButtonElement>(null);

  const dismiss = () => dispatch({ type: 'dismiss' });

  const confirm = () => {
    if (content?.callback) {
      content.callback();
    }

    dismiss();
  };

  const notify = (content: DialogContent, options?: DialogOptions) =>
    dispatch({
      type: 'notify',
      content,
      options,
    });

  return (
    <DialogContext.Provider value={{ dismiss, notify }}>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={dismiss}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading>{content?.title}</Heading>
            </AlertDialogHeader>
            <AlertDialogBody minHeight="unset">
              {content?.message}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Grid templateColumns="repeat(2, 1fr)" gap={1} width="full">
                <GridItem>
                  <Button
                    ref={cancelRef}
                    variant="outline"
                    onClick={dismiss}
                    aria-label="cancel"
                    width="full"
                  >
                    {cancelLabel}
                  </Button>
                </GridItem>
                <GridItem>
                  <Button
                    onClick={confirm}
                    ml={3}
                    aria-label="confirm"
                    variant="primary"
                    width="full"
                  >
                    {confirmLabel}
                  </Button>
                </GridItem>
              </Grid>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
