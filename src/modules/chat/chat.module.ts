import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entity/Chat.entity';
import { ImgChatEntity } from './entity/ImgChat.entity';
import { UsersEntity } from './entity/Users.entity';
import { MisChatsEntity } from './entity/MisChats.entity';
import { MiembrosEntity } from './entity/Miembros.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity,ImgChatEntity,UsersEntity,MisChatsEntity,MiembrosEntity])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
