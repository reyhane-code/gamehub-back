import * as sharp from 'sharp';
import { ImageFormat } from '../files/enums/image-format';
import { ImgaeFit } from 'src/files/enums/image-fit.enum';

const allowedFormats = ['png', 'jpg', 'jpeg', 'webp'];

export const changeProperties = async (
  file: Buffer,
  format?: ImageFormat,
  width?: number,
  height?: number,
  quality: number = 80,
  fit?: ImgaeFit,
  lossless: boolean = true,
): Promise<Buffer> => {
  const image = sharp(file);
  const metadata = await image.metadata();
  const {
    height: imageOriginalHeight,
    width: imageOriginalWidth,
    format: imageOriginalFormat,
  } = metadata;

  return image
    .toFormat(getFormat(format, imageOriginalFormat), {
      quality: validNumberOrSetDefault(80, quality),
      lossless,
    })
    .resize(
      getResizeConfig(
        width,
        height,
        imageOriginalWidth,
        imageOriginalHeight,
        fit,
      ),
    )
    .toBuffer();
};

const validNumberOrSetDefault = (defaultNum: number, number?: number) => {
  return number && !isNaN(number) ? number : defaultNum;
};
const getResizeConfig = (
  width?: number,
  height?: number,
  imageOriginalWidth?: number | undefined,
  imageOriginalHeight?: number | undefined,
  fit?: ImgaeFit,
): { width: number; height: number; fit: ImgaeFit } => {
  return {
    width: validNumberOrSetDefault(imageOriginalWidth || 300, width),
    height: validNumberOrSetDefault(imageOriginalHeight || 300, height),
    fit: fit ?? ImgaeFit.COVER,
  };
};

const getFormat = (
  format: string | undefined,
  imageOriginalFormat: string | undefined,
): any => {
  return format && allowedFormats.includes(format.toString())
    ? format
    : imageOriginalFormat || 'webp';
};
