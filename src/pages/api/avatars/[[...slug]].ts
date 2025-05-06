import type { AbilitiesApiRequest } from '@/models';

import { getScope, getUser, updateScope, updateUser } from '@/prisma';
import { subject } from '@casl/ability';
import {
  Catch,
  createHandler,
  Param,
  ParseNumberPipe,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from 'next-api-decorators';
import * as R from 'ramda';
import { getSupabaseClient } from '@/utils/get-supabase-client';
import type { NextApiResponse } from 'next';
import { defaultExceptionHandler } from '@/utils/default-exception-handler';
import { Authorize } from '@/backend/middleware/authorize/authorize';
import { WithAbilities } from '@/backend/middleware/with-abilities/with-abilities';
import { uploadToStorage } from '@/utils/upload-to-storage';

const getFileName = (inputString: string): string =>
  R.last(R.split('/', inputString)) || '';

@Catch(defaultExceptionHandler)
class AvatarsHandler {
  @Put('/user/:id')
  @Authorize()
  @WithAbilities()
  public async updateUserAvatar(
    @Param('id') id: string,
    @Req() req: AbilitiesApiRequest,
    @Res() res: NextApiResponse
  ) {
    if (req.userId !== id) {
      throw new UnauthorizedException();
    }

    const user = await getUser({ id });

    const supabase = getSupabaseClient(req, res);

    const data = await uploadToStorage(req, supabase);

    await updateUser({ id, image: data.publicUrl });

    if (!!user.image) {
      await supabase.storage.from('avatars').remove([getFileName(user.image)]);
    }

    return data;
  }

  @Put('/scope/:id')
  @Authorize()
  @WithAbilities()
  public async updateScopeAvatar(
    @Param('id', ParseNumberPipe) id: number,
    @Req() req: AbilitiesApiRequest,
    @Res() res: NextApiResponse
  ) {
    if (!req.abilities.can('edit', subject('Scope', { id }))) {
      throw new UnauthorizedException();
    }

    const scope = await getScope(id);

    const supabase = getSupabaseClient(req, res);

    const data = await uploadToStorage(req, supabase);

    await updateScope({ id, image: data.publicUrl });

    if (!!scope.image) {
      await supabase.storage.from('avatars').remove([getFileName(scope.image)]);
    }

    return data;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createHandler(AvatarsHandler);


