import { EntityRepository, Repository } from 'typeorm';
import { BillingInfo } from './billing-info.entity';
import { SaveBillingInfoDto } from './dto/save-billing-info.dto';
import { UpdateBillingInfoDto } from './dto/update-billing-info.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getObjectId, getString } from 'src/utilities';
import { User } from 'src/users/user.entity';

@EntityRepository(BillingInfo)
export class BillingInfoRepository extends Repository<BillingInfo> {
  saveBillingInfo(billingInfo: SaveBillingInfoDto, user: User) {
    const newBillingInfo = this.create({
      ...billingInfo,
      userId: getString(user.id),
    });
    return this.save(newBillingInfo);
  }

  async updateBillingInfo(billingInfo: UpdateBillingInfoDto, user: User) {
    //mongo specific
    const objectId = getObjectId(billingInfo.id);
    let billingInfoToUpdate = await this.findOne(objectId);

    if (!billingInfoToUpdate) {
      throw new NotFoundException(
        `Billing Info with id ${billingInfo.id} not found`,
      );
    }

    //validate that this billing info belongs to the user
    const userId = getString(user.id);

    if (userId !== billingInfoToUpdate.userId) {
      throw new BadRequestException(
        `Billing Info with id ${billingInfo.id} does not belong to user ${userId}`,
      );
    }
    //remove id from the dto
    delete billingInfo.id;
    //update the billing info
    billingInfoToUpdate = {
      ...billingInfoToUpdate,
      ...billingInfo,
    };

    return this.save(billingInfoToUpdate);
  }
}
