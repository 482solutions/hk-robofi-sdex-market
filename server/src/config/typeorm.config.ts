import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Organisation } from '../organisation/entities/organisation.entity';
import { Measurement } from '../measurements/entities/measurement.entity';
import { Station } from '../station/entities/station.entity';
import { Country } from '../station/entities/country.entity';
import { Region } from '../station/entities/region.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST?? 'localhost',
    port: parseInt(process.env.DB_PORT) ?? 5432,
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'near_eacs',
    entities: [Organisation, Station, Measurement, Country, Region],
    synchronize: true,
};
