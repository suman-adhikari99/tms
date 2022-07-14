import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
let AWS = require('aws-sdk');

const baseDomain = 'https://edfluent-tms.s3.amazonaws.com';

@Injectable()
export class S3UploaderService {
  async upload(file, user) {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12.
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    // count number of character in day
    let dayCount = day.toString().length;
    let newDay = '';
    if (dayCount === 1) {
      newDay = '0' + day;
    } else {
      newDay = day.toString();
    }

    let monthCount = month.toString().length;
    let newMonth = '';
    if (monthCount === 1) {
      newMonth = '0' + month;
    } else {
      newMonth = month.toString();
    }
    let newDate = year + '' + newMonth + '' + newDay;
    // let newDate = year + '' + month + '' + day;

    const { originalname } = file;
    const filename = `${user.id.toString()}/${newDate}/${originalname}`;

    //need to move bucket to config
    const bucketS3 = 'edfluent-tms';
    // const reqUrl = `${baseDomain}/${filename}`;
    return this.uploadS3(file.buffer, bucketS3, filename);
  }

  getS3() {
    //need to move credentials to config
    return new AWS.S3({
      accessKeyId: 'AKIA2RIADVIU3AJPEL4G',
      secretAccessKey: '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',
    });
  }

  async downloadAsStream(bucket: string, key: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: key,
    };

    // // return new Promise((resolve, reject) => {
    const stream = s3
      .getObject(params)
      .createReadStream({ encoding: 'base64' });

    return new Promise((resolve, reject) => {
      const buffer: any[] = [];
      stream.on('error', reject);
      stream.on('data', (chunk) => buffer.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(buffer).toString('base64')));
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

  async s3Movement(oldKey, newKey) {
    const s3 = this.getS3();
    const bucketName = 'edfluent-tms'; // example bucket
    const folderToMove = oldKey; // old folder name
    const destinationFolder = newKey; // new destination folder
    try {
      const listObjectsResponse = await s3
        .listObjects({
          Bucket: bucketName,
          Prefix: folderToMove,
          Delimiter: '/',
        })
        .promise();

      const folderContentInfo = listObjectsResponse.Contents;
      const folderPrefix = listObjectsResponse.Prefix;

      await Promise.all(
        folderContentInfo.map(async (fileInfo) => {
          await s3
            .copyObject({
              Bucket: bucketName,
              CopySource: `${bucketName}/${fileInfo.Key}`, // old file Key
              Key: `${destinationFolder}`, // new file Key
            })
            .promise();

          await s3
            .deleteObject({
              Bucket: bucketName,
              Key: fileInfo.Key,
            })
            .promise();
        }),
      );
    } catch (err) {
      console.error(err); // error handling
    }
  }

  mapS3Response(data, size) {
    let arr = data.split('/');
    let userId = arr[Math.floor(arr.length / 2)];
    const file = {
      uploadedBy: userId,
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
  // https://edfluent-tms.s3.ap-south-1.amazonaws.com/629c2d1b467732ea0c46b3d4/20220607/Invoice%23%20629eff485becc43828ac6894.pdf
  async downloadFile(filename: string) {
    return `${baseDomain}/${filename}`;
  }

  async deleteFiles(files) {
    const s3 = this.getS3();
    const objects = files.files.map((arr) => {
      return {
        Key: arr.fileName,
      };
    });

    const params = {
      Bucket: 'edfluent-tms',
      Delete: {
        Objects: objects,
        Quiet: false,
      },
    };

    try {
      try {
        s3.deleteObjects(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
            // console.log('data >>>', data); // successful response
            return {
              message: 'File Deleted Successfully',
            };
          }
        });
      } catch (err) {
        throw new BadRequestException('File not Found delete objects');
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err.code);
      throw new NotFoundException('File not Found head object');
    }
  }

  async deleteFile(fileLink) {
    console.log('fileLink', fileLink);

    const s3 = this.getS3();
    console.log('fileLink >>>>', fileLink, Object.values(fileLink)[0]);
    // for(let i=0; i<fileLink.length; i++){
    const params = {
      Bucket: 'edfluent-tms',
      // Key: fileLink,
      Key: Object.values(fileLink)[0],
      // Key: '62542e44bbb8e71a5c75f229/202244/Manuscript-Document.pdf', //if any sub folder-> path/of/the/folder.ext
    };
    try {
      await s3.headObject(params).promise();
      console.log('File Found in S3');
      try {
        await s3.deleteObject(params).promise();
        return {
          message: 'File Deleted Successfully',
        };
        // console.log('file deleted Successfully');
      } catch (err) {
        throw new BadRequestException('File not Found');

        // console.log('ERROR in file Deleting : ' + JSON.stringify(err));
        // return { message: 'ERROR in file Deleting : ' + JSON.stringify(err) };
      }
    } catch (err) {
      console.log('File not Found ERROR : ' + err);
      throw new NotFoundException('File not Found');

      // return { message: 'File Not Found ' + err.code };
    }
  }

  // list all files from amazon s3
  async fetchAllFiles() {
    const s3 = this.getS3();

    // s3.bucket('edfluent-tms');
    // return s3.bucket('edfluent-tms').objects();
    // return s3.bucket('edfluent-tms').objects('', '');
    // puts s3.bucket("edfluent-tms").objects(prefix:'', delimiter: '/').collect(&:key)

    const files: Array<{ name: string }> = [];
    const data = await s3.listObjectsV2({ Bucket: 'edfluent-tms' }).promise();

    if (data && data.Contents) {
      for (const item of data.Contents) {
        files.push({ name: item.Key });
      }
    }
    return { files };
    // if(data && data.Contents){
    //   data.Contents.forEach(element => {
    //     files.push({name:element.Key})
    //   });
    // }
  }

  getUrl(filename: string) {
    const reqUrl = `${baseDomain}/${filename}`;
    return reqUrl;
  }
}

// AWS.config.update({
//   accessKeyId: 'AKIA2RIADVIU3AJPEL4G',
//   secretAccessKey: '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',
//   region: 'ap-south-1',
// });
