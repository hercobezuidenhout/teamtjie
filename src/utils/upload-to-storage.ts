import { UserApiRequest } from '@/models';
import { SupabaseClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import { parseImage } from './parse-image';
import {
  BadRequestException,
  InternalServerErrorException,
} from 'next-api-decorators';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const uploadToStorage = async (
  req: UserApiRequest,
  supabase: SupabaseClient
) => {
  let files: formidable.Files;

  try {
    files = (await parseImage(req)).files;
  } catch (error) {
    const message = (error as Error)?.message;

    if (message && message.includes('options.maxTotalFileSize')) {
      throw new BadRequestException(
        `Please ensure the file is smaller than 64KB.`
      );
    }

    throw new InternalServerErrorException();
  }

  let file = files['avatar'];

  if (!file) {
    throw new BadRequestException(
      `Please ensure the file is tagged with 'avatar'`
    );
  }

  if (Array.isArray(file)) {
    if (file.length > 1) {
      throw new BadRequestException('Please upload a single file');
    }

    file = file[0];
  }

  if (file.mimetype !== 'image/png') {
    throw new BadRequestException('Only .png images may be uploaded');
  }

  const newId = uuidv4();
  const fileContent = await fs.promises.readFile(file.filepath);
  const { data: uploadPath, error } = await supabase.storage
    .from('avatars')
    .upload(`${newId}.png`, fileContent, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    throw new InternalServerErrorException(error.message);
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(uploadPath.path);

  return data;
};
