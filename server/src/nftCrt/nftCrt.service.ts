import { Injectable, Logger } from "@nestjs/common";
import { CreateNftCrtDto } from "./dto/create-nftCrt.dto";
import { DEFAULT_FUNCTION_CALL_GAS } from "near-api-js";
import { NftCrt, Pagination } from "./entities/nftCrt.entity";
import { BN } from "bn.js";
import { ExecutionStatus } from "near-api-js/lib/providers/provider";
import { DEFAULT_GAS, NearCrtService } from "src/nearCrt/nearCrt.service";
import { ToucanClient } from "toucan-sdk/dist";
import { Network } from "toucan-sdk/dist/types";
import { ethers, utils } from "ethers";

const STORAGE_DEPOSIT = new BN("15000000000000000000000", 10);

@Injectable()
export class NftCrtService {
  private logger = new Logger("NftCrtService");
  private near: NearCrtService;

  constructor(near: NearCrtService) {
    this.logger.log("Constructing NftCrtService");
    this.near = near;
  }

  async create(data: CreateNftCrtDto) {
    const { tco2, amount, owner } = data;
    if (process.env.TOUCAN_EN == 'true') {
      this.logger.log(`Enabled ${process.env.TOUCAN_NETWORK} network`)
      const provider = ethers.getDefaultProvider(process.env.TOUCAN_RPC);
      const signer = new ethers.Wallet(process.env.TOUCAN_KEY, provider);
      const toucan = new ToucanClient(process.env.TOUCAN_NETWORK as Network, provider, signer);
      const poolToken = await toucan.getPoolContract(tco2.type);
      const gasPrice = utils.formatUnits(await provider.getGasPrice(), "gwei");
      this.logger.log(`Gas price - ${gasPrice}`)
      const redeemTxn = await poolToken.redeemMany(
            [tco2.address],
            [ethers.utils.parseEther(amount)],
            {
              gasLimit: '2500000',
              gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei')
            }
        );
      const res = await redeemTxn.wait();
      tco2.externalHash = res.transactionHash;
    } else {
      this.logger.log(`Disabled ${process.env.TOUCAN_NETWORK} network`)
      tco2.externalHash = '0x5c108e72079e948304d5867956201ae3bd71be075023b7eb0e8f5b047b2ac18d';
    }
    if (tco2.type == 'BCT') {
      const a = parseFloat(amount) * 0.75;
      tco2.amount = a.toFixed(3).toString();
    } else if (tco2.type == 'NCT') {
      const a = parseFloat(amount) * 0.9;
      tco2.amount = a.toFixed(3).toString();
    } else {
      tco2.amount = amount;
    }

    const account = await this.near.owner();
    const result = await account.functionCall({
      methodName: "nft_mint",
      contractId: account.accountId,
      args: {
        token_id: Math.floor(Date.now() / 1000),
        metadata: { ...tco2, mintTime: Math.floor(Date.now() / 1000) },
        receiver_id: owner,
      },
      gas: DEFAULT_FUNCTION_CALL_GAS,
      attachedDeposit: STORAGE_DEPOSIT
    });

    const value = await account.connection.provider.txStatus(result.transaction_outcome.id, account.accountId)
      .then(resp => resp.status) as ExecutionStatus;

    return { status: 'ok', token: Buffer.from(value.SuccessValue, "base64").toString() };
  }

  async findAll(params: Pagination) {
    const { from_index, limit, owner_id } = params;

    const account = this.near.owner();

    try {
      const result = await account.functionCall({
        methodName: "nft_tokens",
        contractId: account.accountId,
        args: {
          from_index,
          limit
        },
        gas: DEFAULT_GAS
      });

      const value = await account.connection.provider.txStatus(result.transaction_outcome.id, account.accountId)
        .then(resp => resp.status) as ExecutionStatus;

      const tokens: NftCrt[] = JSON.parse(Buffer.from(value.SuccessValue, "base64").toString());

      return owner_id ? tokens.filter(pred => pred.owner_id === owner_id) : tokens;
    } catch (e) {
      return e.message;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }

  async retire(data) {
    let retireHash = '';
    if (process.env.TOUCAN_EN  == 'true') {
      this.logger.log(`Enabled ${process.env.TOUCAN_NETWORK} network`)
      const provider = ethers.getDefaultProvider(process.env.TOUCAN_RPC);
      const signer = new ethers.Wallet(process.env.TOUCAN_KEY, provider);
      const toucan = new ToucanClient(process.env.TOUCAN_NETWORK as Network, provider, signer);
      const gasPrice = utils.formatUnits(await provider.getGasPrice(), "gwei");
      const TCO2 = toucan.getTCO2Contract(data.tco2Address);
      const retirementTxn =
        await TCO2.retireAndMintCertificate(
          data.retirementEntityName,
          '0x56eEFfe29fD0e3b27fc370418559bd540d3ea3C0',
          data.beneficiaryName,
          data.retirementMessage,
          ethers.utils.parseEther(data.amount),
          {
            gasLimit: '2500000',
            gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei')
          }
        );
      await retirementTxn.wait();
      retireHash  = retirementTxn.hash
    } else {
      this.logger.log(`Disabled ${process.env.TOUCAN_NETWORK} network`)
      retireHash = '0xda22b794f21b1ee4fe47167f0f541e9376addb9cd091c3eef36f34b34d0a1059';
    }
    const retireMetada = {
      retirementEntityName: data.retirementEntityName,
      beneficiaryAddress: data.beneficiaryAddress,
      beneficiaryName: data.beneficiaryName,
      retirementMessage: data.retirementMessage,
      retirementTime: Math.floor(Date.now() / 1000)
    }

    const account = await this.near.owner();
    const value = await account.functionCall({
      methodName: "nft_tco2_ritire",
      contractId: account.accountId,
      args: {
        token_id: data.nftCrtId,
        retireHash,
        retireMetada
      },
      gas: DEFAULT_FUNCTION_CALL_GAS,
      attachedDeposit: STORAGE_DEPOSIT
    }).then(resp => resp.status) as ExecutionStatus;

    this.logger.log('Retire status ',Buffer.from(value.SuccessValue, "base64").toString())
    return { status: 'ok', result: Buffer.from(value.SuccessValue, "base64").toString() };
  }
}
