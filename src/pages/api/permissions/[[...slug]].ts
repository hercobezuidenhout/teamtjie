import { Authorize } from "@/backend";
import type { UserApiRequest } from "@/models";
import { userRoles } from "@/permissions/roles";
import { getScopePermissions } from "@/prisma/queries/get-scope-permissions";
import { defaultExceptionHandler } from "@/utils";
import { Catch, createHandler, Get, Req } from "next-api-decorators";

@Catch(defaultExceptionHandler)
class PermissionsHandler {
    @Get()
    @Authorize()
    public async get(@Req() req: UserApiRequest) {
        const roles = await userRoles(req.userId);
        const scopeRoles = await getScopePermissions(roles.map(role => role.scopeId));

        return { roles, scopeRoles };
    }
}

export default createHandler(PermissionsHandler);