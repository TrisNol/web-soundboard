import { Controller, Delete, Get, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { SoundService } from "./sound.service";

import 'multer';

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
    public async createSound(@UploadedFile() file: Express.Multer.File): Promise<void> {
        return;
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