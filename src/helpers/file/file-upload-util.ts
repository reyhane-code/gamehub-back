import { Request } from 'express';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const editFileName = (
  _: Request,
  file: Express.Multer.File,
  callback
) => {
  callback(null, `${uuid()}${extname(file.originalname)}`);
};

export const imageFileFilter = (
  _: Request,
  file: Express.Multer.File,
  callback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};