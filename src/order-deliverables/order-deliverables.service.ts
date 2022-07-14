import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderDeliverablesService {
  constructor() {}
  async orderDeliverables() {
    return [
      {
        title: 'New order Lorem ipsum dolores constradium ssssssssss',
        date: '21/04/2021',
        invoiceId: 'sdfghjkl',
        totalCost: 123,
        documents: {
          Manuscripts1: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample1.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample2.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
          Invoices2: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample3.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample4.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
        },
      },
      {
        title: 'One order Order title goes here.. Order Title goes here.. ',
        date: '21/04/2021',
        invoiceId: 'sdfghjkl',
        totalCost: 123,
        documents: {
          Manuscripts3: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample5.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample6.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
          Invoices4: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample7.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample8.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
        },
      },
      {
        title: 'Order title goes here.. Order Title goes here.. ',
        date: '21/04/2021',
        invoiceId: 'sdfghjkl',
        totalCost: 123,
        documents: {
          Manuscripts5: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample9.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample10.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
          Invoices6: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample11.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample12.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
        },
      },
      {
        title: 'One order One order One order One order',
        date: '21/04/2021',
        invoiceId: 'sdfghjkl',
        totalCost: 123,
        documents: {
          Manuscripts7: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample13.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample14.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
          Invoices8: {
            createdAt: '21/04/2021 09:04AM',
            updatedAt: '21/04/2021 09:04AM',
            files: [
              {
                name: 'sample15.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample16.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
              {
                name: 'sample17.docx',
                url: 'http://dummy.doesnot.exit',
                type: 'Microsoft DOC File',
                uploadedBy: 'Rumiko Shika',
                uploadedDate: '21/04/2021 09:04AM',
                size: '2.0MB',
                storageUsed: '2.0MB',
              },
            ],
          },
        },
      },
    ];
  }
}
