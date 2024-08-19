import { Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { SoundService } from "./sound.service";

import 'multer';
import { Sound } from "../core/database/sound/sound.entity";

@Controller("sound")
export class SoundController {

    constructor(
        private readonly soundService: SoundService
    ) { }

    @Get("/")
    public async getAllSounds(): Promise<Array<any>> {
        return this.soundService.getSounds();
    }

    @Get(":id")
    public async getSoundById(@Param('id') id: string): Promise<StreamableFile> {
        const fileBuffer = await this.soundService.getSound(id);
        return new StreamableFile(fileBuffer, {
            type: "audio/mpeg",
        });
    }

    @Post("/")
    @UseInterceptors(FileInterceptor('file'))
    public async createSound(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 5 * 1024**2,  }), // 5 MiB
                new FileTypeValidator({ fileType: 'audio/mpeg' }),
            ],
        }),
    )
    file: Express.Multer.File): Promise<Sound> {
        return this.soundService.createSound(file.originalname, file.buffer);
    }

    @Delete(":id")
    public async deleteSound(@Param('id') id: string): Promise<void> {
        return;
    }

    @Delete("/")
    public async deleteAllSounds(): Promise<void> {
        return;
    }
}