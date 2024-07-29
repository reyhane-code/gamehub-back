import {
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { Repositories } from '../enums/database.enum';
import { changeProperties } from '../helpers/sharp-helper';
import { GetFileQueryDto } from './dtos/get-file-query.dto';
import { fileType } from './enums/file-type.enum';
import { GameFile } from 'models/game_file.model';

@Injectable()
export class FilesService {
  constructor(
    @Inject(Repositories.GAME_FILES)
    private gameFilesRepository: typeof GameFile,
  ) {}

  async readAndSetFileProperties(
    query: GetFileQueryDto,
    res: Response,
  ): Promise<StreamableFile> {
    const { hashKey } = query;
    let file: ReadStream;
    try {
      const dist = join(`${process.cwd()}/files/`, hashKey);
      file = createReadStream(dist);
      if (!file) new NotFoundException('file not found');
    } catch (e) {
      console.log(e);
      throw new NotFoundException('file not found');
    }
    const foundFile = await this.gameFilesRepository.findOne({
      where: {
        hash_key: hashKey,
      },
    });
    if (!foundFile) new NotFoundException('file not found');
    if (foundFile?.type == fileType.IMAGE) {
      return this.getImageFile(file, query, res);
    }
    // TODO: handel other type of file
    return new StreamableFile(file);
  }

  async getImageFile(
    file: ReadStream,
    query: GetFileQueryDto,
    res: any,
  ): Promise<StreamableFile> {
    const { hashKey } = query;
    const hashKeySplited = hashKey.split('.');
    const mimeTypeHashKey = hashKeySplited[hashKeySplited.length - 1];
    const type = query.format || mimeTypeHashKey;
    res.header('Content-Type', type);
    res.header('ETag', hashKey);
    res.header('Content-Disposition', `attachment; filename="${hashKey}"`);
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
          );
          resolve(new StreamableFile(changedFile));
        } catch (error) {
          reject(error);
        }
      });
      file.on('error', (error) => {
        console.log('run 7');
        reject(error);
      });
    });
  }
}
