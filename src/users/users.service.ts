import { compare, hash, genSalt } from "bcrypt";
import _ from "lodash";
import { EntityManager, Repository } from "typeorm";

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import { Users } from "./entities/users.entity";
import { JwtPayload } from "./types/jwt-payload.interface";
import { Points } from "src/points/entities/point.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    name: string,
    transactionManager: EntityManager,
  ) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        "이미 해당 이메일로 가입된 사용자가 있습니다!",
      );
    }

    const saltRounds = this.configService.get<number>("PASSWORD_SALT_ROUNDS");
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);

    try {
      const user = transactionManager.create(Users, {
        email,
        password: hashedPassword,
        name,
      });
      await transactionManager.save(user);
      const defaultPoints = 1000000;
      await transactionManager.getRepository(Points).save({
        amount: defaultPoints,
        user_id: user.id,
      });

      // throw new NotFoundException('트랜잭션 롤백 테스트')
      return { message: "회원가입에 성공하였습니다." };
    } catch (error) {
      throw new InternalServerErrorException(
        "사용자 등록 중 오류가 발생했습니다.",
      );
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userRepository.findOne({
        select: ["id", "email", "password"],
        where: { email },
      });
      if (_.isNil(user)) {
        throw new UnauthorizedException("이메일을 확인해주세요."); // 401 잘못된 요청 에러
      }

      if (!(await compare(password, user.password))) {
        throw new UnauthorizedException("비밀번호를 확인해주세요."); // 401 잘못된 요청 에러
      }

      const payload: JwtPayload = { id: user.id, email };

      const accessToken = this.jwtService.sign(payload, { expiresIn: "1d" });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });

      return { message: `로그인에 성공하였습니다`, accessToken, refreshToken };
    } catch (error) {
      console.log("error:", error);
      throw new UnauthorizedException("로그인 실패");
    }
  }

  async findOneById(id: number) {
    const userInfos = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (_.isNil(userInfos)) {
      throw new NotFoundException(`존재하지 않는 ${id}입니다.`);
    }
    return userInfos;
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
