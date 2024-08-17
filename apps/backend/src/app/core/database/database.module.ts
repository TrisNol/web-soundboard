import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SoundModule } from "./sound/sound.module";

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'sqlite',
            storage: 'apps/backend/src/assets/db/data.sqlite3',
            autoLoadModels: true,
            synchronize: true,
        }),
        SoundModule
    ],
    controllers: [],
    providers: [],
    exports: [SoundModule]
})
export class DatabaseModule { }