import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from './entity/Chat.entity';
import {Repository} from "typeorm";
import { MensajeCreate } from './dto/mensaje.dto';
import { ImgChatEntity } from './entity/ImgChat.entity';
import { raw } from 'express';
import { UsersEntity } from './entity/Users.entity';
import { MisChatsEntity } from './entity/MisChats.entity';
import { MiembrosEntity } from './entity/Miembros.entity';
import { In } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ImgChatEntity)
    private readonly imgChatRepository: Repository<ImgChatEntity>,
    @InjectRepository(UsersEntity) private readonly userRepository:Repository<UsersEntity>,
    @InjectRepository(MisChatsEntity) private readonly misChatsRepository: Repository<MisChatsEntity>,
    @InjectRepository(MiembrosEntity) private readonly miembrosRepository:Repository<MiembrosEntity>
  ) {
  }
  async conexionUsuario(idUsuario){
    await this.userRepository.update(idUsuario,{
      conectado: true
    })
  }

  async saveMassage(mensajeRequest: MensajeCreate){
    const nuevoMensaje = this.chatRepository.create({
      chat_id: mensajeRequest.chat_id,
      user_id: mensajeRequest.user_id,
      mensaje: mensajeRequest.mensaje,
      created_at: new Date()
    });

    const mensajeGuardado = await this.chatRepository.save(nuevoMensaje)

    // 2. Si viene la imagen, crear el registro en ImgChatEntity
    if (mensajeRequest.url_img) {
      const imagen = this.imgChatRepository.create({
        mensaje_id: mensajeGuardado.id,
        url_img: mensajeRequest.url_img,
      });
      await this.imgChatRepository.save(imagen);
    }

    // 3. Opcional: cargar las relaciones y devolver todo junto
    return this.chatRepository.findOne({
      where: { id: mensajeGuardado.id },
      relations: ['autor', 'imagenes'],
    });
  }

  async getMessage(chat_id: number): Promise<ChatEntity[]> {
    return await this.chatRepository.find({where:{chat_id},relations:['autor','imagenes'], order:{id: 'ASC'}});
  }

  async mostaraMensajeNuevo(id){
    return await this.chatRepository.findOne({
      where:{id},
      relations:['autor','imagenes']
    })
  }

  async actualizarClienteSocketId(user_id,cliente_socket){
    await this.miembrosRepository.update(user_id,{
      cliente_socket_id:cliente_socket
    })
  }

  async getMiembros(user_id){

    const chats = await this.misChatsRepository.find({where:{user_id}, select:['chat_id']})
    const chatIds = chats.map(m => m.chat_id);

    if (chatIds.length === 0) {
      return []; // No hay chats, devolvemos array vacío
    }

    return  await this.miembrosRepository.find({
        where:{
          chat_id: In(chatIds)
        }
    })

  }


}
