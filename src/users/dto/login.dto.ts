
import { PickType } from '@nestjs/mapped-types';
import { Users } from '../entities/users.entity';

export class LoginDto extends PickType(Users, ['email','password']) {
}


