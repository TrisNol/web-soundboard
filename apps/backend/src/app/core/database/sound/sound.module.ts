import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sound } from "./sound.entity";
import { SoundRepository } from "./sound.repository";

@Module({
    imports: [SequelizeModule.forFeature([Sound])],
    providers: [SoundRepository],
    exports: [SequelizeModule, SoundRepository]
})
export class SoundModule { }