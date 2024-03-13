import { PartialType } from "@nestjs/mapped-types";
import { CreatePointsDto } from "./create-point.dto";

export class UpdatePointDto extends PartialType(CreatePointsDto) {}
