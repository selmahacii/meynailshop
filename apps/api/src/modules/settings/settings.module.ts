import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettings } from '../../database/entities';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SiteSettings])],
    providers: [SettingsService],
    controllers: [SettingsController],
    exports: [SettingsService],
})
export class SettingsModule { }
