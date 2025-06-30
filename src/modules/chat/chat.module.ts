import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entity/Chat.entity';
import { ImgChatEntity } from './entity/ImgChat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity,ImgChatEntity])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
