import { diskStorage } from 'fastify-file-interceptor';
import { editFileName, imageFileFilter } from './file-upload-util';


export const multerOptions = {
    storage: diskStorage({
        destination: './files',
        filename: editFileName,
    }),
    fileFilter: imageFileFilter,
}