import { IFile } from "src/mail/interfaces";

export interface EmailResponse {
  _id: string;
  to: string[];
  from: string;
  subject: string;
  content: string;
  attachments?: IFile[];
  createdDate?: string;
  senderDetails?: {
    role?: {
      mainRoles: string[];
      activeRole: string;
    } | null;
    fullName: string;
    image?: string | null;
  };
  scheduledDate?: string | null;
  draft?: boolean;
  isArchived?: boolean;
}