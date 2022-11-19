import { Global, Module } from "@nestjs/common";
import { NearCrtService } from "./nearCrt.service";


@Global()
@Module({
  providers: [NearCrtService],
  exports: [NearCrtService]
})
export class NearCrtModule {}