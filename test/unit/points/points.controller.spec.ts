import { Test, TestingModule } from "@nestjs/testing";
import { PointsController } from "../../../src/points/points.controller";
import { PointsService } from "../../../src/points/points.service";

describe("PointsController", () => {
  let controller: PointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [PointsService],
    }).compile();

    controller = module.get<PointsController>(PointsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
