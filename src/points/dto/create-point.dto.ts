import { PickType } from "@nestjs/mapped-types";
import { Points } from "../entities/point.entity";

export class CreatePointsDto extends PickType(Points, ["amount", "user_id"]) {}
