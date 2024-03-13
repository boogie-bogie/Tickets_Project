import { Role } from "src/users/types/usersRole.type";

import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
