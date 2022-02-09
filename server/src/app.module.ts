import { Module } from '@nestjs/common';
import { StationModule } from './station/station.module';
import { OrganisationModule } from './organisation/organisation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { MeasurementsModule } from './measurements/measurements.module';
import { Measurement } from './measurements/entities/measurement.entity';
import { Organisation } from './organisation/dto/organisation.entity';
import { Station } from './station/station.entity';
import { Country } from './station/country.entity';
import { Region } from './station/region.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([Organisation, Station, Country, Region, Measurement]),
        StationModule,
        OrganisationModule,
        MeasurementsModule,
    ],
})
export class AppModule {}
