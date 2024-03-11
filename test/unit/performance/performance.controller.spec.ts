import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceController } from '../../../src/performance/performance.controller';
import { PerformanceService } from '../../../src/performance/performance.service';

describe('PerformanceController', () => {
  let controller: PerformanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceController],
      providers: [PerformanceService],
    }).compile();

    controller = module.get<PerformanceController>(PerformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
