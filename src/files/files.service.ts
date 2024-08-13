import {
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { changeProperties } from '../helpers/sharp-helper';
import { GetFileQueryDto } from './dtos/get-file-query.dto';
import { Repository } from 'src/enums/database.enum';
import { File } from 'models/file.model';
import { isImage } from 'src/helpers/file.helper';

@Injectable()
export class FilesService {
  constructor(@Inject(Repository.FILES) private filesRepository: typeof File) {}

  async readAndSetFileProperties(
    query: GetFileQueryDto,
    res: Response,
  ): Promise<StreamableFile> {
    const { hashKey } = query;
    const foundFile = await this.filesRepository.findOne({
      where: { hash_key: hashKey },
    });

    if (!foundFile) {
      throw new NotFoundException('File not found');
    }

    const dist = this.getFilePath(hashKey, foundFile.file_type);
    const file = this.getFileStream(dist);

    if (isImage(`${hashKey}.${foundFile.file_type}`)) {
      return this.getImageFile(file, query, res, foundFile.file_type);
    }

    // TODO: Handle other types of files
    return new StreamableFile(file);
  }

  private getFilePath(hashKey: string, fileType: string): string {
    const filesDirectory = `${process.cwd()}/files/`;
    return join(filesDirectory, `${hashKey}.${fileType}`);
  }

  private getFileStream(filePath: string): ReadStream {
    try {
      const file = createReadStream(filePath);
      if (!file) {
        throw new NotFoundException('File not found');
      }
      return file;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('File not found');
    }
  }

  async getImageFile(
    file: ReadStream,
    query: GetFileQueryDto,
    res: any,
    fileType: string,
  ): Promise<StreamableFile> {
    const { hashKey } = query;
    const type = query.format ?? fileType;

    res.header('Content-Type', type);
    res.header('ETag', hashKey);
    res.header(
      'Content-Disposition',
      `attachment; filename="${hashKey}.${type}"`,
    );
    return new Promise<StreamableFile>((resolve, reject) => {
      const datas = [] as any[];
      file.on('data', (d) => {
        datas.push(d);
      });
      file.on('close', async () => {
        const buffer = Buffer.concat(datas);
        try {
          const changedFile = await changeProperties(
            buffer,
            query.format,
            Number(query.width),
            Number(query.height),
            Number(query.quality),
            query.fit,
          );
          resolve(new StreamableFile(changedFile));
        } catch (error) {
          reject(error);
        }
      });
      file.on('error', (error) => {
        reject(error);
      });
    });
  }
}
