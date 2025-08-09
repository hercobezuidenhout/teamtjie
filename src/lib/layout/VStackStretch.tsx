import { StackProps, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const VStackStretch = ({ children, gap }: PropsWithChildren & Pick<StackProps, 'gap'>) => (
    <VStack alignItems="stretch" width="full" gap={gap}>{children}</VStack>
);