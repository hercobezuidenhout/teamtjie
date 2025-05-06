'use client';

import { Box, Button } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { animate, useAnimate } from 'framer-motion';

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

interface SparkleButtonProps extends PropsWithChildren {
    emoji?: string;
    onClick: () => void;
}

export const SparkleButton = ({ emoji, onClick, children }: SparkleButtonProps) => {
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
                duration: 0.3,
                at: '<'
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
                at: '<'
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
            ...sparklesAnimation,
            ['button', { scale: [0.8, 1, 0] }, { duration: 0.3 }],
            ...sparklesFadeOut
        ]).then(() => {
            onClick();
        });

    };

    return (
        <Box as="div" ref={scope}>
            <Button onClick={onButtonClick}>
                {emoji && emoji}
                {children}
                <Box
                    as="span"
                    aria-hidden
                    className="sparkles"
                    position="absolute"
                    inset={0}
                    display="block"
                    pointerEvents="none">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <Sparkle key={index} index={index} />
                    ))}
                </Box>
            </Button>
        </Box>
    );
};