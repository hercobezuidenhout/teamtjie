import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => (
    <Flex alignItems="center" height="85vh" justifyContent="space-around">
        {children}
    </Flex>
)

export default Layout;