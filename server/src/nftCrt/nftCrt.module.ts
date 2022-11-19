import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { NftCrtService } from './nftCrt.service';
import { NftCrtController } from './nftCrt.controller';

@Module({
  imports: [ConfigModule],
  controllers: [NftCrtController],
  providers: [NftCrtService]
})
export class NftCrtModule {}
