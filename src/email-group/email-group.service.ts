import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { getObjectId } from 'src/utilities';
import { EmailGroupDto } from './dto/create-email-group.dto';
import { UpdateEmailGroupDto } from './dto/update-email-group.dto';
import { EmailGroupRepository } from './email-group.repository';

@Injectable()
export class EmailGroupService {
  constructor(
    @InjectRepository(EmailGroupRepository)
    private emailGroupRepository: EmailGroupRepository,
  ) {}

  async makeEmailGroup(emailGroupDto: EmailGroupDto, user: User) {
    const { groupName, description, groupMember } = emailGroupDto;
    const emailGroup = await this.emailGroupRepository.create({
      createdBy: user.id.toString(),
      groupName,
      description,
      groupMember,
    });
    return this.emailGroupRepository.save(emailGroup);
  }

  //get myemail templates
  async getEmailGroup(user: User) {
    return await this.emailGroupRepository.find({
      where: { createdBy: user.id.toString() },
    });
  }

  async updateEmailGroup(id: string, updateDto: UpdateEmailGroupDto) {
    const objectId = getObjectId(id);
    const emailGroup = await this.emailGroupRepository.findOne(objectId);
    if (!emailGroup) {
      throw new NotFoundException(`Email Group not found`);
    } else {
      const { groupName, description, groupMember } = updateDto;
      emailGroup.groupName = groupName;
      emailGroup.description = description;
      emailGroup.groupMember = groupMember;
      return await this.emailGroupRepository.save(emailGroup);
    }
  }

  async deleteEmailGroup(id: string) {
    const objectId = getObjectId(id);
    const emailGroup = await this.emailGroupRepository.findOne(objectId);
    if (!emailGroup) {
      throw new NotFoundException(`Email Template not found`);
    } else {
      return await this.emailGroupRepository.delete(objectId);
    }
  }

  async removeMemberFromGroup(id: string, userId: string) {
    const objectId = getObjectId(id);
    const emailGroup = await this.emailGroupRepository.findOne(objectId);
    if (!emailGroup) {
      throw new NotFoundException(`Email Template not found`);
    } else {
      const memberIndex = emailGroup.groupMember.findIndex(
        (each) => each.userId == userId,
      );

      emailGroup.groupMember.splice(memberIndex, 1);

      return await this.emailGroupRepository.save(emailGroup);
    }
  }
}
