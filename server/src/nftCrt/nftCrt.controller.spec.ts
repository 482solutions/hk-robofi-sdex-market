import { Test, TestingModule } from '@nestjs/testing';
import { NftCrtController } from './nftCrt.controller';
import { NftCrtService } from './nftCrt.service';

describe('NftController', () => {
  let controller: NftCrtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftCrtController],
      providers: [NftCrtService],
    }).compile();

    controller = module.get<NftCrtController>(NftCrtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
