import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';

const baseDomain = 'https://uploader.axiossoftwork.com';

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', createReadStream(file.path));
    formData.append('project', 'tms');

    const requestConfig = {
      headers: {
        'x-secret-code': 'sabin_dai_is_cute',
        ...formData.getHeaders(),
      },
    };

    const response = await axios.post(
      `${baseDomain}/upload/single`,
      formData,
      requestConfig,
    );

    await unlink(file.path);
    const path = response.data.path;

    if (!path) {
      throw new Error('File upload failed');
    }
    const reqUrl = `${baseDomain}/file/${path}`;
    const res = await axios.get(reqUrl);
    return {
      file: res.data,
    };
  }
}
