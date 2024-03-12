import { compare, hash, genSalt } from 'bcrypt';
import _ from 'lodash';
import { DataSource, Repository } from 'typeorm';

import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Users } from './entities/users.entity';
import { JwtPayload } from './types/jwt-payload.interface';
import { Points } from 'src/points/entities/point.entity';



@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService, 
  ) {}

  async signup(email: string, password: string, name: string):Promise<void> {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
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

    try {
    const user = queryRunner.manager.getRepository(Users).create({
    // const user = this.userRepository.create({ 
      email,
      password: hashedPassword,
      name
    });
      await queryRunner.manager.getRepository(Users).save(user);
      //await this.userRepository.save(user);
      // throw new NotFoundException('트랜잭션 롤백 테스트 - 에러 던지기')

      // 포인트 생성 및 저장
      const defaultPoints = 1000000;
      await queryRunner.manager.getRepository(Points).save({
        amount: defaultPoints,
        user_id: user.id
      });
      //await this.pointsService.createPoints(defaultPoints, user.id);

      await queryRunner.commitTransaction();

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log("error:", error);

    } finally {
      await queryRunner.release();
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
  
  async findOneById(id: number) {
    const userInfos = await this.userRepository.findOne({
      where: {
        id,
      },
    })

    if (_.isNil(userInfos)) {
      throw new NotFoundException(`존재하지 않는 ${id}입니다.`)
    }
    return userInfos;
  }

  async findByEmail(email: string):Promise<Users> { 
    return await this.userRepository.findOne({ where: {email }});
  }
}