import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IManuscript } from 'src/orders/interfaces';
import { getObjectId } from 'src/utilities';
import { AddFolderDto } from './dto/add-folder.dto';
import { NewFolderRepository } from './new-folder.repository';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectClosureRepository } from 'src/project-closure/project-closure.repository';
import { ReviewOrder } from 'src/review-orders/review-orders.entity';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { DeleteFileDto } from './dto/deleteFileDto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Invoices } from 'src/deliverables/dto/place-deliverables.dto';

@Injectable()
export class NewFolderService {
  constructor(
    @InjectRepository(NewFolderRepository)
    private readonly newFolderRepository: NewFolderRepository,
    private s3Service: S3UploaderService,
    @InjectRepository(ProjectManagement)
    private projectRepository: ProjectManagement,
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    @InjectRepository(ProjectClosureRepository)
    private projectClosureRepository: ProjectClosureRepository,
    @InjectRepository(ReviewOrderRepository)
    private reviewOrderRepository: ReviewOrderRepository,
  ) {}

  async addFolderInProject(newFolder: AddFolderDto) {
    const { manuscriptFile, projectId } = newFolder;

    const folder = await this.newFolderRepository.create({
      ...newFolder,
      projectId: projectId.toString(),
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      manuscriptFile: manuscriptFile.map((member) => {
        return {
          ...member,
          uploadedBy: member.uploadedBy,
          fileId: member.fileId,
          fileName: member.fileName,
          filePath: member.filePath,
          fileSize: member.fileSize,
          fileType: member.fileType,
          uploadedAt: new Date().toISOString(),
          uploadedTime: new Date().toLocaleTimeString(),
        };
      }),
    });
    return await this.newFolderRepository.save(folder);
  }

  async addFolderInOrder(newFolder: AddFolderDto) {
    const { manuscriptFile, orderId } = newFolder;

    const folder = await this.newFolderRepository.create({
      ...newFolder,
      orderId: orderId.toString(),
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      manuscriptFile: manuscriptFile.map((member) => {
        return {
          ...member,
          uploadedBy: member.uploadedBy,
          fileId: member.fileId,
          fileName: member.fileName,
          filePath: member.filePath,
          fileSize: member.fileSize,
          fileType: member.fileType,
          uploadedAt: new Date().toISOString(),
          uploadedTime: new Date().toLocaleTimeString(),
        };
      }),
    });
    return await this.newFolderRepository.save(folder);
  }

  async addFolderInAssistance(newFolder: AddFolderDto) {
    const { manuscriptFile, orderId, assistanceRequestId } = newFolder;

    const folder = await this.newFolderRepository.create({
      ...newFolder,
      // orderId: orderId.toString(),
      assistanceRequestId,
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      manuscriptFile: manuscriptFile.map((member) => {
        return {
          ...member,
          uploadedBy: member.uploadedBy,
          fileId: member.fileId,
          fileName: member.fileName,
          filePath: member.filePath,
          fileSize: member.fileSize,
          fileType: member.fileType,
          uploadedAt: new Date().toISOString(),
          uploadedTime: new Date().toLocaleTimeString(),
        };
      }),
    });
    return await this.newFolderRepository.save(folder);
  }

  async addFolderInAssistanceFromRequestClosure(newFolder) {
    const {
      editorCertificate,
      evaluationCertificate,
      orderId,
      assistanceRequestId,
    } = newFolder;

    let manuscriptFiles = [];
    manuscriptFiles.push(editorCertificate, evaluationCertificate);
    const folder = await this.newFolderRepository.create({
      ...newFolder,
      // orderId: orderId.toString(),
      assistanceRequestId,
      folderName: 'Certificate',
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      manuscriptFile: manuscriptFiles,
    });
    return await this.newFolderRepository.save(folder);
  }

  async addFolderInOrderFromProjectClosure(projectClosure) {
    const { editorCertificate, evaluationCertificate, orderId } =
      projectClosure;

    const files = [];
    files.push(editorCertificate);
    files.push(evaluationCertificate);

    const folder = await this.newFolderRepository.create({
      orderId: orderId.toString(),
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      folderName: 'Certificate',
      manuscriptFile: files,
    });
    return this.newFolderRepository.save(folder);
  }

  // add folder in order of project
  async addFolderInOrderOfProject(projectId) {
    const folders = await this.newFolderRepository.find({
      where: { projectId },
    });
    const objectId = getObjectId(projectId);
    const project = await this.projectRepository.findOne(objectId);

    // copy whole folder object into order folder
    for (let i = 0; i < folders.length; i++) {
      const { manuscriptFile, folderName, createdDate, updatedDate } =
        folders[i];
      const folder = await this.newFolderRepository.create({
        manuscriptFile,
        orderId: project.orderId,
        folderName,
        createdDate,
        updatedDate,
      });
      console.log('Folder sabbai folder of project >>>', folder);

      this.newFolderRepository.save(folder);
    }
  }

  async updateFolderById(id: string, updatedFolder: UpdateFolderDto) {
    try {
      const objectId = getObjectId(id);
      const folder = await this.newFolderRepository.findOne(objectId);
      let { manuscriptFile } = folder;
      if (!folder) {
        throw new NotFoundException('Folder not found');
      } else {
        folder.updatedDate = new Date().toISOString();
        manuscriptFile.push(...updatedFolder.manuscriptFile);
        folder.manuscriptFile = manuscriptFile;
        return await this.newFolderRepository.save(folder);
      }
    } catch (err) {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async getFolders() {
    return await this.newFolderRepository.find();
  }

  async getFoldersOfAProject(id: string) {
    const folder = await this.newFolderRepository.find({
      where: { projectId: id },
    });
    return folder;
  }

  async getInvoiceByOrderId(id: string) {
    try {
      const reviewOrder = await this.reviewOrderRepository.findOne({
        where: { orderId: id },
      });
      const invoice = reviewOrder.invoice;
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      } else {
        return invoice;
      }
    } catch {
      throw new NotFoundException('Invoice not found');
    }
  }

  async getFoldersOfAnOrder(id: string) {
    try {
      const folder = await this.newFolderRepository.find({
        where: { orderId: id },
      });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      } else {
        return folder;
      }
    } catch {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async getFoldersOfAnAssistance(id: string) {
    try {
      const folder = await this.newFolderRepository.find({
        where: { assistanceRequestId: id },
      });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      } else {
        return folder;
      }
    } catch {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async getFoldersOfProject(id: string) {
    try {
      const folder = await this.newFolderRepository.find({
        where: { projectId: id },
      });
      if (!folder) {
        throw new NotFoundException('Folder not found');
      } else {
        return folder;
      }
    } catch {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async getFolderById(id: string) {
    try {
      const objectId = getObjectId(id);
      const folder = await this.newFolderRepository.findOne(objectId);
      if (!folder) {
        throw new NotFoundException('Folder not found');
      } else {
        return folder;
      }
    } catch (err) {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async deleteFolderById(id: string) {
    try {
      const objectId = getObjectId(id);
      const folder = await this.newFolderRepository.findOne(objectId);
      if (!folder) {
        throw new NotFoundException('Folder not found');
      } else {
        await this.newFolderRepository.delete(folder);
      }
    } catch (err) {
      throw new NotFoundException('Folder not found catched');
    }
  }

  // remove particular deiverable from folder
  async removeManuscriptFromFolder(id: string, fileId: string) {
    try {
      const objectId = getObjectId(id);
      const folder = await this.newFolderRepository.findOne(objectId);
      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      console.log('folder >>>>>>>>>>>>>>>', folder);
      let file = await folder.manuscriptFile.find(
        (item) => item.fileId === fileId.toString(),
      );

      console.log('file of NEW FOLDER >>>>>>>>', file);
      if (!file) throw new NotFoundException('File Not Found');

      folder.manuscriptFile.splice(folder.manuscriptFile.indexOf(file), 1);
      let f = file.filePath;
      let link = f.split('/').splice(3).join('/');
      let fileLink = { fileLink: link };
      this.s3Service.deleteFile(fileLink);

      // folder.manuscriptFile = manuscriptFile;

      return this.newFolderRepository.save(folder);
    } catch (err) {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async removeManuscriptFromFolderJustUploaded(deleteFile: DeleteFileDto) {
    try {
      const { filePath } = deleteFile;
      console.log(
        'filePath>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
        filePath,
      );

      this.s3Service.deleteFile(filePath);

      // return { message: 'File Deleted Successfully' };
    } catch (err) {
      throw new NotFoundException('Folder not found catched');
    }
  }

  async addFolderInOrderToAddInvoice(reviewOrder) {
    let file = [];
    file.push(reviewOrder.invoice.file);
    const folder = await this.newFolderRepository.create({
      orderId: reviewOrder.orderId,
      folderName: 'Invoice',
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      manuscriptFile: file,
    });
    this.newFolderRepository.save(folder);
  }
}
