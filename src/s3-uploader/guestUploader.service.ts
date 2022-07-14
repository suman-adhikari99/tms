import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
let AWS = require('aws-sdk');

const baseDomain = 'https://edfluent-tms.s3.amazonaws.com';

@Injectable()
export class GuestService {
  async upload(file) {
    console.log('Guest Uploaded File', file);
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12.
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let newDate = year + '' + month + '' + day;

    const { originalname } = file;
    const filename = `${newDate}/${originalname}`;

    //need to move bucket to config
    const bucketS3 = 'edfluent-tms';
    const reqUrl = `${baseDomain}/${filename}`;
    return this.uploadS3(file.buffer, bucketS3, filename);
  }

  getS3() {
    //need to move credentials to config
    return new S3({
      accessKeyId: 'AKIA2RIADVIU3AJPEL4G',
      secretAccessKey: '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',
    });
  }

  async uploadS3(file, bucket: string, name: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        const size = Math.round(file.byteLength / 1024);
        resolve(this.mapS3Response(data.Location, size + ' KB'));
      });
    });
  }

  mapS3Response(data, size) {
    const file = {
      uploadedBy: '',
      filePath: data,
      fileName: data.split('/').pop(),
      fileType: data.split('.').pop(),
      fileSize: size,
      fileId: Math.floor(Math.random() * 100000000000).toString(),
      uploadedAt: new Date().toISOString(),
      uploadedTime: new Date().toLocaleTimeString(),
    };
    return file;
  }
  async downloadFile(filename: string) {
    return `${baseDomain}/${filename}`;
  }

  async deleteFile(filename: string) {
    AWS.config.update({
      accessKeyId: 'AKIA2RIADVIU3AJPEL4G',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'edfluent-tms',
      Key: filename, //if any sub folder-> path/of/the/folder.ext
    };
    try {
      await s3.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await s3.deleteObject(params).promise();
        console.log('file deleted Successfully');
      } catch (err) {
        console.log('ERROR in file Deleting : ' + JSON.stringify(err));
        return 'ERROR in file Deleting : ' + JSON.stringify(err);
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
      return 'File Not Found' + err.code;
    }
  }

  // list all files from amazon s3
  async fetchAllFiles() {
    AWS.config.update({
      accessKeyId: 'AKIA2RIADVIU3AJPEL4G',
      secretAccessKey: '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',
      region: 'ap-south-1',
    });
    const s3 = new AWS.S3();

    const files: Array<{ name: string }> = [];
    const data = await s3.listObjectsV2({ Bucket: 'edfluent-tms' }).promise();

    if (data && data.Contents) {
      for (const item of data.Contents) {
        files.push({ name: item.Key });
      }
    }
    return { files };
  }

  getUrl(filename: string) {
    const reqUrl = `${baseDomain}/${filename}`;
    return reqUrl;
  }
}
