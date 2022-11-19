import { Test, TestingModule } from '@nestjs/testing';
import { NftCrtService } from './nftCrt.service';

describe('NftService', () => {
  let service: NftCrtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftCrtService],
    }).compile();

    service = module.get<NftCrtService>(NftCrtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
