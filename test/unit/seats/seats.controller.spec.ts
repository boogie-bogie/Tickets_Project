import { Test, TestingModule } from '@nestjs/testing';
import { SeatsController } from '../../../src/seats/seats.controller';
import { SeatsService } from '../../../src/seats/seats.service';

describe('SeatsController', () => {
  let controller: SeatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatsController],
      providers: [SeatsService],
    }).compile();

    controller = module.get<SeatsController>(SeatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
