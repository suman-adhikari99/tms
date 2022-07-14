import { EntityRepository, Repository } from 'typeorm';
import { ResetPassword } from './reset-password.entity';

@EntityRepository(ResetPassword)
export class ResetPasswordRepository extends Repository<ResetPassword> {}
