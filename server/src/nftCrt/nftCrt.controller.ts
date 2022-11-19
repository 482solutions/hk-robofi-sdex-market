import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { NftCrtService } from "./nftCrt.service";
import { CreateNftCrtDto } from "./dto/create-nftCrt.dto";

@Controller("nft-crt")
export class NftCrtController {
  constructor(private readonly nftCrtService: NftCrtService) {
  }

  @Post()
  create(@Body() data: CreateNftCrtDto) {
    return this.nftCrtService.create(data);
  }

  @Put()
  retire(@Body() data) {
    return this.nftCrtService.retire(data);
  }

  @Get()
  findAll(@Query("from") from: string, @Query("limit") limit: number, @Query("owner") owner: string) {
    return this.nftCrtService.findAll({ from_index: from, limit: +limit, owner_id: owner });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.nftCrtService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.nftCrtService.remove(+id);
  }
}
