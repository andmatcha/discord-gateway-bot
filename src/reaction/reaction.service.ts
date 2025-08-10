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
    // リアクションを取得
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        this.logger.error('Failed to fetch the reaction', error);
        return;
      }
    }

    // ユーザーがボットの場合は無視
    if (user.bot) return;

    // 検出するチャンネルと絵文字を指定
    const targetChannelId = '1402771854384435352';
    const targetEmoji = '👍';

    // チャンネルと絵文字のチェック
    if (reaction.message.channelId !== targetChannelId) return;
    if (reaction.emoji.name !== targetEmoji) return;

    // ログ出力
    const emoji = reaction.emoji.id ?? reaction.emoji.name;
    this.logger.log(
      `${user.username} reacted to the message(ID: ${reaction.message.id}) with ${emoji}.`,
    );
  }
}
