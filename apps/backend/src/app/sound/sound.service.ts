import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as fs from "fs";
import { SoundRepository } from "../core/database/sound/sound.repository";
import { EnvironmentVariables } from "../common/interfaces/environment-variables.interface";
import { Sound } from "../core/database/sound/sound.entity";
import { Sequelize, Transaction } from "sequelize";
import { InjectConnection } from "@nestjs/sequelize";
import { ChecksumAlgorithm, generateChecksum } from "../common/utils/checksum.utills";

@Injectable()
export class SoundService {
    constructor(
        private readonly configService: ConfigService<EnvironmentVariables>,
        private readonly soundRepository: SoundRepository,
        @InjectConnection()
        private connection: Sequelize,
    ) { }

    
    private buildPath(id: string): string {
        return `${this.configService.get<string>("ASSETS_PATH")}/${id}.mp3`;
    }

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

    public async createSound(name: string, file: Buffer): Promise<Sound> {
        const transaction: Transaction = await this.connection.transaction();
        try {
            const dbEntry = await this.soundRepository.create({
                name: name,
                checksum: generateChecksum(file, ChecksumAlgorithm.SHA256),
            });
            const path = this.buildPath(dbEntry.id);
            fs.writeFileSync(path, file);
            transaction.commit();
            return dbEntry;
        } catch(e) {
            console.error(e);
            transaction.rollback();
            throw new InternalServerErrorException("Failed to create sound");
        }
    }
}