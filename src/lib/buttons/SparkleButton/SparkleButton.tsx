'use client';

import { Box, Button, VisuallyHidden } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { animate, stagger, useAnimate } from 'framer-motion';

const randomNumberBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

type AnimationSequence = Parameters<typeof animate>[0];

interface SparkleProps {
    index: number;
}

const Sparkle = ({ index }: SparkleProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        fill="none"
        viewBox="0 0 200 200"
        className={`sparkle sparkle-${index}`}
        style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            opacity: '0'
        }}
    >
        <path style={{
            fill: 'rgb(255, 85, 85)'
        }} d="M80 0s4.285 41.292 21.496 58.504C118.707 75.715 160 80 160 80s-41.293 4.285-58.504 21.496S80 160 80 160s-4.285-41.293-21.496-58.504C41.292 84.285 0 80 0 80s41.292-4.285 58.504-21.496C75.715 41.292 80 0 80 0z"></path>
    </svg>
);


export const SparkleButton = ({ children }: PropsWithChildren) => {
    const [scope, animate] = useAnimate();

    const onButtonClick = () => {
        const sparkles = Array.from({ length: 20 });
        const sparklesAnimation: AnimationSequence = sparkles.map((_, index) => [
            `.sparkle-${index}`,
            {
                x: randomNumberBetween(-100, 100),
                y: randomNumberBetween(-100, 100),
                scale: randomNumberBetween(1.5, 2.5),
                opacity: 1,
            },
            {
                duration: 0.4,
                at: '<',
            },
        ]);
        const sparklesFadeOut: AnimationSequence = sparkles.map((_, index) => [
            `.sparkle-${index}`,
            {
                opacity: 0,
                scale: 0,
            },
            {
                duration: 0.3,
                at: '<',
            },
        ]);

        const sparklesReset: AnimationSequence = sparkles.map((_, index) => [
            `.sparkle-${index}`,
            {
                x: 0,
                y: 0,
            },
            {
                duration: 0.000001,
            },
        ]);

        animate([
            ...sparklesReset,
            ['.letter', { y: -32 }, { duration: 0.2, delay: stagger(0.05) }],
            ['button', { scale: 0.8 }, { duration: 0.1, at: '<' }],
            ['button', { scale: 1 }, { duration: 0.1, at: '<' }],
            ...sparklesAnimation,
            ['.letter', { y: 0 }, { duration: 0.00001, at: 0.5 }],
            ...sparklesFadeOut,
        ]);
    };

    return (
        <Box as="div" ref={scope}>
            <Button onClick={onButtonClick}>
                <VisuallyHidden className="sr-only">{children}</VisuallyHidden>
                <Box as="span" className="word" height="2rem" overflow="hidden" display="flex" alignItems="center" justifyContent="center">
                    {children?.toString().split('').map((letter, index) => (
                        <Box
                            as="span"
                            className="letter"
                            data-letter={letter}
                            key={`${index}${letter}`}
                            display="inline-block"
                            position="relative"
                            height="2rem"
                            lineHeight="2rem"
                            _after={{
                                height: '2rem',
                                position: 'absolute',
                                left: '0',
                                top: '100%',
                                content: 'attr(data-letter)',
                            }}>
                            {letter}
                        </Box>
                    ))}
                </Box>
                <Box
                    as="span"
                    aria-hidden
                    className="sparkles"
                    position="absolute"
                    inset={0}
                    display="block"
                    pointerEvents="none"
                    zIndex={-10}>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <Sparkle key={index} index={index} />
                    ))}
                </Box>
            </Button>
        </Box>
    );
};