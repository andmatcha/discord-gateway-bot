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
        this.logger.error('Failed to fetch a reaction.', error);
        return;
      }
    }

    // ユーザーがボットの場合は無視
    if (user.bot) return;

    // -------- 1. 特定のチャンネルでメッセージに特定の絵文字(A)がつけられたことを検知する -------- //

    // 検出するチャンネルと絵文字を指定
    const targetChannelId = '1402771854384435352';
    const targetEmoji = String.fromCodePoint(0x1f44d); // 絵文字(A)

    // チャンネルと絵文字のチェック
    if (reaction.message.channelId !== targetChannelId) return;
    if (reaction.emoji.name !== targetEmoji) return;

    // ログ出力
    const emoji = reaction.emoji.id ?? reaction.emoji.name;
    this.logger.log(
      `${user.username} reacted to the message(ID: ${reaction.message.id}) with ${emoji}.`,
    );

    // -------- 2. そのメッセージからA以外すべての絵文字を消去する -------- //
    const reactions = reaction.message.reactions.cache;

    try {
      for (const [, reaction] of reactions) {
        if (reaction.emoji.name === targetEmoji) continue;
        await reaction.remove();
      }
      this.logger.log('Successfully removed reactions.');
    } catch (error) {
      this.logger.error('Failed to remove reactions.', error);
    }

    // -------- 3. そのメッセージに指定した絵文字たち(B)をbotを使って付与する -------- //
    const emojisToAdd = [0x26be, 0x26bd, 0x1f3c0].map((code) =>
      String.fromCodePoint(code),
    ); // 絵文字たち(B)

    try {
      for (const emoji of emojisToAdd) {
        await reaction.message.react(emoji);
      }
      this.logger.log('Successfully added reactions.');
    } catch (error) {
      this.logger.error('Failed to add reactions.', error);
    }
  }
}
