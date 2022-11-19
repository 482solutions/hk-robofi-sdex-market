import { Test, TestingModule } from '@nestjs/testing';
import { NearCrtService } from './nearCrt.service';

describe('NearService', () => {
  let service: NearCrtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NearCrtService],
    }).compile();

    service = module.get<NearCrtService>(NearCrtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
