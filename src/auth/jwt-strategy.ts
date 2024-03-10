import _ from 'lodash'; 
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

import { Injectable, NotFoundException  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService, 
    private readonly configService: ConfigService,
    ) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email); 
    if (_.isNil(user)) { 
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.'); // 404
    }

    console.log('jwt-strategy-user:', user)
    return user;
  }
}
