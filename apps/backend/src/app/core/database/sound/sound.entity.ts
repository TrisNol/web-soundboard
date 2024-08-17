import { UUIDV4 } from 'sequelize';
import { Column, Table, Model } from 'sequelize-typescript';

@Table({
    tableName: 'sound',
})
export class Sound extends Model {
    @Column({
        primaryKey: true,
        defaultValue: UUIDV4,
    })
    id: string;

    @Column({
        allowNull: false,
        comment: 'Name of the sound',
    })
    name: string;
    
    @Column({
        allowNull: false,
        comment: 'SHA-256 checksum of the sound file, kept for integrity checks',
    })
    checksum: string;
}