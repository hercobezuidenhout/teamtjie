import { Flex, Text } from '@chakra-ui/react';
import { Fragment } from 'react';

export interface PostCardBodyValuesProps {
  isSmall?: boolean;
  values?: string[];
}

export const PostCardBodyValues = ({
  isSmall = false,
  values = [],
}: PostCardBodyValuesProps) => {
  const capitalizeAndJoin = (inputString) => {
    const wordsArray = inputString.split(' ');
    const capitalizedWords = wordsArray.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    const resultString = '#' + capitalizedWords.join('');

    return resultString;
  };

  return (
    <Flex gap={1} direction={isSmall ? 'column' : 'row'}>
      {values.map((value) => (
        <Fragment key={value}>
          <Text fontSize="sm" color="chakra-subtle-text">
            {capitalizeAndJoin(value)}
          </Text>
        </Fragment>
      ))}
    </Flex>
  );
};
