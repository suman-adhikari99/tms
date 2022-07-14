import { Injectable } from '@nestjs/common';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { User } from 'src/users/user.entity';
import { getObjectId } from 'src/utilities';
import { EmailRepository } from './email.repository';
import { EmailResponse } from './interfaces';

@Injectable()
export class EmailService {
  constructor(
    private emailRepository: EmailRepository,
    private s3UploaderService: S3UploaderService,
  ) {}

  async createEmail(attachments: Array<Express.Multer.File>, content) {
    const email = {
      to: content.to,
      from: content.from,
      subject: content.subject,
      content: content.content,
      attachments: [],
      createdDate: new Date().toISOString(),
    };
    if (attachments != null && attachments.length > 0) {
      await Promise.all(
        attachments.map(async (attachment) => {
          const response = await this.s3UploaderService.upload(attachment, {
            id: 'email',
          });
          email['attachments'].push(response);
        }),
      );
    }
    const _email = this.emailRepository.create(email);

    return this.emailRepository.save(_email);
  }

  addSenderDetailsIfNotAvailable(emails: EmailResponse[]) {
    for (let email of emails) {
      if (email.senderDetails) continue;

      const sender = email.from;
      const nameEmail = sender.split('<');
      const fullName = nameEmail[0].trim();
      const senderEmail = nameEmail[1].replace(/[<>\s]/g, '');

      email.from = senderEmail;
      email.senderDetails = {
        role: null,
        image: null,
        fullName: fullName,
      };
    }

    return emails;
  }

  async inbox(userEmail: string) {
    const inboxPipeline = [
      {
        $match: {
          to: userEmail,
        },
      },
      {
        $group: {
          _id: '$from',
          email: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'senderDetails',
        },
      },
      {
        $unwind: {
          path: '$senderDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
          'senderDetails.fullName': 1,
          'senderDetails.image': 1,
          'senderDetails.role': 1,
        },
      },
      {
        $unwind: {
          path: '$email',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          'email.senderDetails': '$senderDetails',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$email',
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    const inboxEmails = await this.emailRepository
      .aggregate(inboxPipeline)
      .toArray();
    return this.addSenderDetailsIfNotAvailable(inboxEmails);
  }

  async outbox(userEmail: string) {
    const outboxPipeline = [
      {
        $match: {
          from: userEmail,
        },
      },
      {
        $group: {
          _id: '$from',
          email: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'senderDetails',
        },
      },
      {
        $unwind: {
          path: '$senderDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
          'senderDetails.fullName': 1,
          'senderDetails.image': 1,
          'senderDetails.role': 1,
        },
      },
      {
        $unwind: {
          path: '$email',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          'email.senderDetails': '$senderDetails',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$email',
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    const outboxEmails = await this.emailRepository
      .aggregate(outboxPipeline)
      .toArray();
    return this.addSenderDetailsIfNotAvailable(outboxEmails);
  }

  async draft(userEmail: string) {
    const draftPipeline = [
      {
        $match: {
          from: userEmail,
          draft: true,
        },
      },
      {
        $group: {
          _id: '$from',
          email: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'senderDetails',
        },
      },
      {
        $unwind: {
          path: '$senderDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
          'senderDetails.fullName': 1,
          'senderDetails.image': 1,
          'senderDetails.role': 1,
        },
      },
      {
        $unwind: {
          path: '$email',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          'email.senderDetails': '$senderDetails',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$email',
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    const draftEmails = await this.emailRepository
      .aggregate(draftPipeline)
      .toArray();
    return this.addSenderDetailsIfNotAvailable(draftEmails);
  }

  async saveDraft(attachments: Array<Express.Multer.File>, content) {
    const email = {
      to: content.to,
      from: content.from,
      subject: content.subject,
      content: content.content,
      draft: true,
      attachments: [],
      createdDate: new Date().toISOString(),
    };
    if (attachments != null && attachments.length > 0) {
      await Promise.all(
        attachments.map(async (attachment) => {
          const response = await this.s3UploaderService.upload(attachment, {
            id: 'email',
          });
          email['attachments'].push(response);
        }),
      );
    }

    const _email = this.emailRepository.create(email);

    return this.emailRepository.save(_email);
  }

  async makeArchive(id: string) {
    const objectId = getObjectId(id);
    const email = await this.emailRepository.findOne(objectId);
    email.isArchived = true;
    return this.emailRepository.save(email);
  }

  async removeFromArchive(id: string) {
    const objectId = getObjectId(id);
    const email = await this.emailRepository.findOne(objectId);
    email.isArchived = false;
    return this.emailRepository.save(email);
  }

  async getArchivedEmail(user: User) {
    const archivePipeline = [
      {
        $match: {
          to: user.email,
          isArchived: true,
        },
      },
      {
        $group: {
          _id: '$from',
          email: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'senderDetails',
        },
      },
      {
        $unwind: {
          path: '$senderDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          email: 1,
          'senderDetails.fullName': 1,
          'senderDetails.image': 1,
          'senderDetails.role': 1,
        },
      },
      {
        $unwind: {
          path: '$email',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          'email.senderDetails': '$senderDetails',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$email',
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    const archiveEmails = await this.emailRepository
      .aggregate(archivePipeline)
      .toArray();
    return this.addSenderDetailsIfNotAvailable(archiveEmails);
  }
}
