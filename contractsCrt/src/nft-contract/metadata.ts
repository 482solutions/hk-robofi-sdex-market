import { Contract } from ".";

export class NFTContractMetadata {
    spec: string;
    name: string;
    symbol: string;
    icon?: string;
    base_uri?: string;
    reference?: string;
    reference_hash?: string;

    constructor(
        {
            spec,
            name,
            symbol,
            icon,
            baseUri,
            reference,
            referenceHash
        }:{
            spec: string,
            name: string,
            symbol: string,
            icon?: string,
            baseUri?: string,
            reference?: string,
            referenceHash?: string
        }) {
        this.spec = spec  // required, essentially a version like "nft-1.0.0"
        this.name = name  // required, ex. "Mosaics"
        this.symbol = symbol // required, ex. "MOSAIC"
        this.icon = icon // Data URL
        this.base_uri = baseUri // Centralized gateway known to have reliable access to decentralized storage assets referenced by `reference` or `media` URLs
        this.reference = reference // URL to a JSON file with more info
        this.reference_hash = referenceHash // Base64-encoded sha256 hash of JSON from reference field. Required if `reference` is included.
    }
}
export class TokenMetadata {
    platform: string;
    projectName: string;
    symbol: string;
    region: string;
    year: string;
    type: string;
    address: string;
    startTime: string;
    endTime: string;
    externalHash: string;
    extra?: string;

    constructor(
        {
            platform,
            projectName,
            symbol,
            region,
            year,
            type,
            startTime,
            endTime,
            externalHash,
            extra,
        }:{
            platform: string,
            projectName: string,
            symbol: string,
            region: string,
            year: string,
            type: string,
            startTime: string,
            endTime: string,
            externalHash: string,
            extra?: string,
        }) {
        this.platform = platform;
        this.projectName = projectName;
        this.symbol = symbol;
        this.region = region;
        this.year = year;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.externalHash = externalHash;
        this.extra = extra;
    }
}
export class Token {
    owner_id: string;
    approved_account_ids: { [accountId: string]: number };
    next_approval_id: number;

    constructor({ 
        ownerId, 
        approvedAccountIds, 
        nextApprovalId
    }:{ 
        ownerId: string, 
        approvedAccountIds: { [accountId: string]: number }, 
        nextApprovalId: number
    }) {
        this.owner_id = ownerId,
        this.approved_account_ids = approvedAccountIds,
        this.next_approval_id = nextApprovalId
    }
}
export class RetireMetadata {
    retirementEntityName: string;
    beneficiaryAddress: string;
    beneficiaryName: string;
    retirementMessage: string;
    retirementTime: string;
    constructor(
        {
            retirementEntityName,
            beneficiaryAddress,
            beneficiaryName,
            retirementMessage,
            retirementTime,
        }:{
            retirementEntityName: string;
            beneficiaryAddress: string;
            beneficiaryName: string;
            retirementMessage: string;
            retirementTime: string;
        }) {
        this.retirementEntityName = retirementEntityName;
        this.beneficiaryAddress = beneficiaryAddress;
        this.beneficiaryName = beneficiaryName;
        this.retirementMessage = retirementMessage;
        this.retirementTime = retirementTime;
    }
}
export class RetireStatus {
    status: boolean;
    retireHash: string;
    retireMetadata: RetireMetadata;
    constructor(
        {
            status,
            retireHash,
            retireMetadata
        }:{
            status: boolean,
            retireHash: string,
            retireMetadata: RetireMetadata
        }) {
        this.status = status;
        this.retireHash = retireHash;
        this.retireMetadata = retireMetadata;

    }
}
export class JsonToken {
    token_id: string;
    owner_id: string;
    metadata: TokenMetadata;
    retireStatus: RetireStatus;

    constructor({ 
        tokenId, 
        ownerId, 
        metadata, 
        retireStatus
    }:{
        tokenId: string,
        ownerId: string,
        metadata: TokenMetadata,
        retireStatus: RetireStatus
    }) {
        this.token_id = tokenId,
        this.owner_id = ownerId,
        this.metadata = metadata,
        this.retireStatus = retireStatus
    }
}

export function internalNftMetadata({
    contract
}:{
    contract: Contract
}): NFTContractMetadata {
    return contract.metadata;
}