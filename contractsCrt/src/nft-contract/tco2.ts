// @ts-nocheck
import { assert, near } from "near-sdk-js";
import { Contract, NFT_METADATA_SPEC, NFT_STANDARD_NAME } from ".";
import { internalAddTokenToOwner, refundDeposit } from "./internal";
import { Token, RetireMetadata, RetireStatus } from "./metadata";

export function tco2Retire({
    contract,
    tokenId,
    retireHash,
    retireMetadata
}:{
    contract: Contract,
    tokenId: string,
    retireHash: string,
    retireMetadata: RetireMetadata;
}): void{
    let token = contract.tokensById.get(tokenId) as Token;

    if (token == null) {
        return null;
    }
    let retire = contract.tokenRetireById.get(tokenId)

    if (retire) {
       return {status: 'true'}
    }

    let retireStatus = new RetireStatus({
        status: true,
        retireHash,
        retireMetadata
    });

    contract.tokenRetireById.set(tokenId, retireStatus)
    return {status: 'retired'}
}

export function tco2RetireStatus({
    contract,
    tokenId,
}:{
    contract: Contract,
    tokenId: string,
}): void{
    let token = contract.tokensById.get(tokenId) as Token;

    if (token == null) {
        return null;
    }

    let retireStatus = contract.tokenRetireById.get(tokenId) as RetireStatus;

    return retireStatus;
}