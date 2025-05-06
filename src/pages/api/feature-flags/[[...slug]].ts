import { createHandler, Get, Query } from 'next-api-decorators';
import { getFeatureFlags } from '@/prisma';

class RegisterHandler {
    @Get()
    public async get(@Query('userId') userId = undefined) {
        return getFeatureFlags(userId);
    }
}

export default createHandler(RegisterHandler);
