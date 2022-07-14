import { SaveBillingInfoDto } from './save-billing-info.dto';

import { PartialType } from '@nestjs/mapped-types';

//make all properties optional
export class UpdateBillingInfoDto extends PartialType(SaveBillingInfoDto) {
  id: string;
}
