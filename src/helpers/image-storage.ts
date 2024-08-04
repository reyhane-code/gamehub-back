// import { diskStorage } from 'multer'
// import { from, of, switchMap } from 'rxjs'
// import { v4 as uuidv4 } from 'uuid'

// const fs = require('fs')
// const FileType = require('file-type')
// const path = require('path')

// type validFileExtension = 'png' | 'jpg' | 'jpeg';
// type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

// export const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
// export const validMimeTypes: validMimeType[] = [
//   'image/png',
//   'image/jpg',
//   'image/jpeg',
// ];

// export const saveImageToStorage = {
//   storage: diskStorage({
//     destination: './files',
//     filename: (req, file, callback) => {
//       const fileExtension: string = path.extname(file.originalname)
//       const fileName: string = uuidv4() + fileExtension //e.g : alksdjfskdjf.png
//       callback(null, fileName)
//     }
//   }),
//   fileFilter: (req, file, callback) => {
//     const result = validMimeTypes.includes(file.mimetype) ? true : false
//     callback(null, result)
//   }
// }

// export const isFileExtensionSafe = (fileFullPath: string) => {
//   return from(FileType.fromFile(fileFullPath)).pipe(
//     // switchMap((fileExtensionAndMimeType: { ext: validFileExtension; mime: validMimeType }) => {
//     //   if (!fileExtensionAndMimeType)
//     //     return of(false)

//     //   const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext)
//     //   const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime)

//     //   const isFileLegit = isFileTypeLegit && isMimeTypeLegit
//     //   return of(isFileLegit)
//     // })
//   )
// }

// const removeFile = (fileFullPath: string) => {
//   try {
//     fs.unlinkSync(fileFullPath)
//   } catch (error) {
//     console.error(error)
//   }
// }

import { extname } from 'path';
import { existsSync, mkdir } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

// Multer upload options
export const multerOptions = {
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = './files';
      // Create folder if doesn't exist
      try {
        if (existsSync(uploadPath)) return cb(null, uploadPath);

        return mkdir(uploadPath, { recursive: true }, (err) => {
          if (err) {
            console.log('err make dir : ', err);
          }
          // => [Error: EPERM: operation not permitted, mkdir 'C:\']
          return cb(null, uploadPath);
        });
      } catch (error) {
        console.log('destination error ', error);
      }
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      try {
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${uuid()}${extname(file.originalname)}`);
      } catch (error) {
        console.log('filename error :   ', error);
      }
    },
  }),
};

export const checkFilesMimetype = (mimetype: string) => {
  if (!mimetype.match(/\/(jpg|jpeg|png|gif)$/))
    throw new BadRequestException('Unsupported file type!');
};
