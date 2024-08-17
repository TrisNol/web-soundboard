

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sound } from './sound.entity';

@Injectable()
export class SoundRepository {
    constructor(
        @InjectModel(Sound)
        private model: typeof Sound,
    ) { }

    async findAll(): Promise<Sound[]> {
        return this.model.findAll();
    }

    async findById(id: string): Promise<Sound | null> {
        return this.model.findByPk(id);
    }

    async create(sound: Partial<Sound>): Promise<Sound> {
        return this.model.create(sound);
    }

    async delete(id: string): Promise<void> {
        const rowsDeleted = await this.model.destroy({
            where: {
                id,
            },
        });
        if (rowsDeleted === 0) {
            throw new Error(`Sound with ID ${id} not found`);
        }
        if (rowsDeleted > 1) {
            throw new Error(`Multiple sounds with ID ${id} found`);
        }
    }
}