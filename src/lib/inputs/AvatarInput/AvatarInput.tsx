import { Image as ChakraImage, Input, VStack } from '@chakra-ui/react';
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';
import React, { useRef, useState } from 'react';
import { canvasPreview } from '@/lib/modals/UpdateAvatarModal/canvas-preview';

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) =>
  centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );

const getBlob = async (image: HTMLImageElement, crop: PixelCrop) => {
  const canvas = await canvasPreview(image, crop);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob !== null) {
        resolve(blob);
      } else {
        reject();
      }
    }, 'image/png');
  });
};

interface AvatarInputProps {
  onChange: (value: Blob | undefined) => void;
}

export const AvatarInput = ({ onChange }: AvatarInputProps) => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const handleChange = async (crop?: PixelCrop) => {
    crop ??= completedCrop;
    if (imgRef.current && crop) {
      const blob = await getBlob(imgRef.current, crop);
      onChange(blob);
    } else {
      onChange(undefined);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
    void handleChange();
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }

    void handleChange();
  };

  const handleComplete = async (crop?: PixelCrop) => {
    setCompletedCrop(crop);
    void handleChange(crop);
  };

  return (
    <VStack align="flex-start" w="full">
      <Input type="file" accept="image/*" onChange={onSelectFile} p={1} />
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={setCrop}
          onComplete={handleComplete}
          aspect={1}
          circularCrop
        >
          <ChakraImage
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
    </VStack>
  );
};
