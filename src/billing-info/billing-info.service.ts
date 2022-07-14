import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { User } from 'src/users/user.entity';
import { getObjectId, getString } from 'src/utilities';
import { BillingInfoRepository } from './billing-info.repository';
import { SaveBillingInfoDto } from './dto/save-billing-info.dto';
import { UpdateBillingInfoDto } from './dto/update-billing-info.dto';

@Injectable()
export class BillingInfoService {
  constructor(
    @InjectRepository(BillingInfoRepository)
    private billingInfoRepository: BillingInfoRepository,
  ) {}

  saveBillingInfo(billingInfo: SaveBillingInfoDto, user: User) {
    return this.billingInfoRepository.saveBillingInfo(billingInfo, user);
  }
  updateBillingInfo(billingInfo: UpdateBillingInfoDto, user: User) {
    return this.billingInfoRepository.updateBillingInfo(billingInfo, user);
  }

  async getBillingInfoByUser(userId: string) {
    const billingInfo = await this.billingInfoRepository.find({
      userId,
    });
    return billingInfo;
  }

  async getBillingsInfoById(id: string) {
    if (!id) {
      throw new BadRequestException('No id provided');
    }
    const found = await this.billingInfoRepository.findOne(getObjectId(id));
    if (!found) {
      throw new NotFoundException(`Billing Info with id ${id} not found`);
    }
    return found;
  }

  async deleteBillingInfo(id: string, user: User) {
    const found = await this.billingInfoRepository.findOne(getObjectId(id));
    if (!found) {
      throw new NotFoundException(`Billing Info with id ${id} not found`);
    }
    if (found.userId !== getString(user.id)) {
      throw new BadRequestException(
        `Billing Info with id ${id} does not belong to user ${user.id}`,
      );
    }
    return this.billingInfoRepository.delete(getObjectId(id));
  }
}
