import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as fs from "fs";
import { SoundRepository } from "../core/database/sound/sound.repository";

@Injectable()
export class SoundService {
    constructor(
        private readonly configService: ConfigService,
        private readonly soundRepository: SoundRepository
    ) { }

    public async getSounds(): Promise<any> {
        return this.soundRepository.findAll();
    }

    public async getSound(id: string): Promise<Buffer> {
        const dbEntry = await this.soundRepository.findById(id);
        if (!dbEntry) {
            throw new NotFoundException(`Sound with ID ${id} not found`);
        }
        const path = this.buildPath(id);
        if (!fs.existsSync(path)) {
            // TODO Delete leftover entry from DB
            throw new InternalServerErrorException(`Sound with ID ${id} no longer available`);
        }
        const buffer = fs.readFileSync(path);
        // TODO check if checksums match
        return Promise.resolve(buffer);
    }

    private buildPath(id: string): string {
        return `${this.configService.get<string>("ASSETS_PATH")}/${id}.mp3`;
    }
}