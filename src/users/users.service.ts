import { compare, hash, genSalt } from 'bcrypt';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Users } from './entities/users.entity';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>, 
    private readonly jwtService: JwtService, 
  ) {}

  async signup(email: string, password: string, name: string):Promise<void> {
    try {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException( // 409 중복 가입
          '이미 해당 이메일로 가입된 사용자가 있습니다!',
        );
      }
      
      const salt = await genSalt();
      console.log('salt:', salt);
  
      const hashedPassword = await hash(password, salt); 
      console.log('hashedPassword:', hashedPassword);
  
      const user = this.userRepository.create({ 
        email,
        password: hashedPassword,
        name
      });

      await this.userRepository.save(user);

    } catch (error) {
      console.log("error:", error);
      throw new InternalServerErrorException("회원가입 실패: 서버 에러")
    }
  }

  async login(email: string, password: string): Promise<{ message: string, accessToken: string, refreshToken: string }> {
    try {
      const user = await this.userRepository.findOne({
        select: ['id', 'email', 'password'],
        where: { email },
      });
      if (_.isNil(user)) {
        throw new UnauthorizedException('이메일을 확인해주세요.'); // 401 잘못된 요청 에러
      }
  
      if (!(await compare(password, user.password))) {
        throw new UnauthorizedException('비밀번호를 확인해주세요.'); // 401 잘못된 요청 에러
      }
  
      const payload: JwtPayload = { id: user.id, email}; 
      
      const accessToken = this.jwtService.sign(payload,  { expiresIn: '1d' })
      const refreshToken = this.jwtService.sign(payload,  { expiresIn: '7d' })

      return { message: `로그인에 성공하였습니다`, accessToken, refreshToken }

    } catch (error) {
      console.log("error:", error);
      throw new UnauthorizedException('로그인 실패');
      
    }
  }

  async findByEmail(email: string) { 
    return await this.userRepository.findOneBy({ email });
  }
}