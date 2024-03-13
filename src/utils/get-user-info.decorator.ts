import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Users } from "src/users/entities/users.entity";

export const GetUserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Users => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ? request.user : null;
  },
);
