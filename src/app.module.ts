import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
      cache: true,
    }),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN ?? '',
      intents: [IntentsBitField.Flags.Guilds],
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID ?? ''],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
