import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
    <Flex height="85vh" justifyContent="space-around" alignItems="center">
        {children}
    </Flex>
);

export default Layout;