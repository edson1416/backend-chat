import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MensajeCreate } from './dto/mensaje.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Get()
  async allChats(){
    return await this.chatService.getMessage(1)
  }

  @Post()
  async save(@Body() mensajeCreate: MensajeCreate){
    return await this.chatService.saveMassage(mensajeCreate)
  }
}
