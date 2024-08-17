import { Module } from "@nestjs/common";
import { SoundController } from "./sound.controller";
import { SoundService } from "./sound.service";
import { CoreModule } from "../core/core.module";

@Module({
    imports: [
        CoreModule
    ],
    controllers: [
        SoundController
    ],
    providers: [
        SoundService
    ],
    exports: []
})
export class SoundModule { }