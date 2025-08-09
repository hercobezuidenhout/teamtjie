import type { NextApiRequest } from 'next';
import formidable, { IncomingForm } from 'formidable';

export const parseImage = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      maxFileSize: 1024 * 64,
    });

    try {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
