import { PoolSymbol } from "toucan-sdk/dist/types";
import { Timestamp } from "typeorm";

export interface Metadata {
    title: string;
    description: string | null;
    expires_at: string | null;
    starts_at: string | null;
    extra: string;
}


export interface Tco2Metadata {
    platform: string,
    projectName: string,
    symbol: string,
    region: string,
    year: string,
    type: PoolSymbol,
    address: string,
    amount: string,
    startTime: Timestamp,
    endTime: Timestamp
    externalHash?: string;
}
export interface CreateNftCrtDto {
    tco2: Tco2Metadata,
    amount: string,
    owner: string,
}
