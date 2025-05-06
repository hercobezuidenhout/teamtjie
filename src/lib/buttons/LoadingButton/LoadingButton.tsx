'use client';

import { ICONS } from '@/lib/icons/icons';
import { Button, ButtonProps, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import { motion, useAnimate } from 'framer-motion';
import { PropsWithChildren, useEffect, useState } from 'react';

interface LoadingButtonProps extends ButtonProps, PropsWithChildren {
    loadingText?: string;
    isLoading: boolean;
    onClick?: () => void;
}

export const LoadingButton = ({ children, loadingText, isLoading, onClick, ...props }: LoadingButtonProps) => {
    const [scope, animate] = useAnimate();
    const [loading, setLoading] = useState(!isLoading);

    const animateLoadingTransition = () =>
        loading
            ? animate([
                ['.loadingState', { opacity: 0 }, { duration: 0.1 }]
            ]).then(() => {
                setLoading(false);
            })
            : animate([
                ['.continueState', { opacity: 0 }, { duration: 0.1 }]
            ]).then(() => {
                setLoading(true);
            });

    const handleHoverStart = () =>
        animate([
            ['.icon', { maxWidth: '16px' }, { duration: 0.1, ease: 'easeInOut' }],
            ['.icon', { marginLeft: '4px' }, { duration: 0.1, ease: 'easeInOut', at: 0.05 }]
        ]);

    const handleHoverEnd = () =>
        animate([
            ['.icon', { maxWidth: '0', marginLeft: '0' }, { duration: 0.1 }]
        ]);

    const handleButtonClick = async () => {
        if (onClick) onClick();
    };

    useEffect(() => {
        animateLoadingTransition();
    }, [isLoading]);

    return (
        <motion.span ref={scope} onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} style={{ width: 'inherit' }}>
            <Button variant="primary" className='button' {...props} onClick={handleButtonClick}>
                {!loading && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Flex className="continueState" alignItems="center">
                            <Text>{children}</Text>
                            <Icon className='icon' maxW={0} aria-label='icon' as={ICONS.ArrowRightIcon} />
                        </Flex>
                    </motion.span>
                )}
                {loading && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Flex className="loadingState" alignItems="center">
                            <Text>{loadingText ? loadingText : ''}</Text>
                            <Spinner size="xs" marginLeft="4px" />
                        </Flex>
                    </motion.span>
                )}
            </Button>
        </motion.span>
    );
};