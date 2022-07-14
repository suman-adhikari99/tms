import { EntityRepository, MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { EditUserDto } from './dto/edit-user-dto';
import { ChangePasswordDto } from './dto/change-password-dto';

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  async editUser(editUserDto: EditUserDto, id: string) {
    const user = await this.findOne(id);
    Object.assign(user, editUserDto);
    return this.save(user);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, id: string) {
    const user = await this.findOne(id);
    Object.assign(user, changePasswordDto);
    return this.save(user);
  }
}
