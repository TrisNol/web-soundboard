import { Controller, Get, Res, StreamableFile } from "@nestjs/common";
import { createReadStream } from "fs";

@Controller("sound")
export class SoundController {


    @Get("/")
    public async getAllSounds(): Promise<Array<any>> {
        return [];
    }

    @Get("/42")
    public getSoundById(): StreamableFile {
        console.log("FHDAIFDHAIS");
        console.log(process.cwd());
        const file = createReadStream("./apps/backend/src/assets/alex_stinkt.mp3");
        return new StreamableFile(file, {
            type: "audio/mpeg",
        });
    }
}