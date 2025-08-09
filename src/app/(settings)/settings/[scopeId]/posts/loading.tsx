import { Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
    return (
        <Flex height="95vh" alignItems="center" justifyContent="space-around">
            <Spinner />
        </Flex>
    );
}