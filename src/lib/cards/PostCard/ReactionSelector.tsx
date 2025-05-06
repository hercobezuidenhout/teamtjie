import { ICONS } from '@/lib/icons/icons';
import {
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Tooltip,
  useBoolean,
  useColorMode,
} from '@chakra-ui/react';
import { EmojiClickData, Theme } from 'emoji-picker-react';
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

interface ReactionSelectorProps {
  onAddReaction: (emoji: string) => void;
}

export const ReactionSelector = ({ onAddReaction }: ReactionSelectorProps) => {
  const [isOpen, { on, off }] = useBoolean();
  const { colorMode } = useColorMode();
  const handleEmojiClick = (emoji: EmojiClickData, _: MouseEvent) => {
    off();
    onAddReaction(emoji.unified);
  };

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      onClose={off}
      closeOnBlur={true}
      placement="right-start"
    >
      <PopoverTrigger>
        <Tooltip label="Add Reaction" borderRadius="md" backgroundColor="chakra-subtle-bg" color="chakra-subtle-text">
          <IconButton
            aria-label={'add reaction'}
            cursor="pointer"
            variant="ghost"
            size="sm"
            onClick={on}
            icon={
              <Icon
                as={ICONS.AddReactionIcon}
                fontSize="xl"
                color="chakra-subtle-text"
              />
            }
          />
        </Tooltip>
      </PopoverTrigger>
      <Portal>
        <PopoverContent boxSize="fit-content">
          <EmojiPicker
            theme={colorMode === 'light' ? Theme.LIGHT : Theme.DARK}
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis
          />
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
