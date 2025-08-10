import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReactionModule } from './reaction/reaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
      cache: true,
    }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('DISCORD_TOKEN', ''),
        intents: [IntentsBitField.Flags.Guilds],
        development: [config.get<string>('DISCORD_DEVELOPMENT_GUILD_ID', '')],
      }),
    }),
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
