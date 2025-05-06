import { PixelCrop } from 'react-image-crop';

export const canvasPreview = async (
  image: HTMLImageElement,
  crop: PixelCrop
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const size = 128;

  canvas.width = size;
  canvas.height = size;

  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.save();

  ctx.drawImage(
    image,
    cropX,
    cropY,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    (size * image.naturalWidth) / crop.width / scaleX,
    (size * image.naturalHeight) / crop.height / scaleY
  );

  ctx.restore();

  return canvas;
};
