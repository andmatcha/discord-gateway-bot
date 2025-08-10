import { Injectable, Logger } from '@nestjs/common';
import { MessageReaction, User } from 'discord.js';
import { Context, On } from 'necord';

@Injectable()
export class ReactionService {
  private readonly logger = new Logger(ReactionService.name);

  @On('messageReactionAdd')
  async handleReactionAdd(
    @Context() [reaction, user]: [MessageReaction, User],
  ) {
    try {
      if (reaction.partial) {
        await reaction.fetch();
      }
      if (user.bot) return;
      const emoji = reaction.emoji.id ?? reaction.emoji.name;
      this.logger.log(
        `${user.username} reacted to the message(ID: ${reaction.message.id}) with ${emoji}.`,
      );
    } catch (error) {
      this.logger.error('Failed to fetch reactions', error);
    }
  }
}
