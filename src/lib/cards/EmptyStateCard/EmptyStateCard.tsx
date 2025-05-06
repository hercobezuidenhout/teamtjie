import { Card, CardBody, Text } from "@chakra-ui/react";

export const EmptyStateCard = () => (
    <Card>
        <CardBody textAlign="center">
            <Text>There is nothing to show.</Text>
        </CardBody>
    </Card>
);