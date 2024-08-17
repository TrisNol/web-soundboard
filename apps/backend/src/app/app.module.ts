import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SoundController } from './sound/sound.controller';

@Module({
  imports: [],
  controllers: [AppController, SoundController],
  providers: [AppService],
})
export class AppModule {}
