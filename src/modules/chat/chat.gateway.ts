import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import * as console from 'node:console';
import { MensajeCreate } from './dto/mensaje.dto';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {
  }

  //al estar conectado al websocket
  handleConnection(client: Socket) {
    console.log(`Usuario conectado ${client.id}`);
  }

  //al estar desconectado al websocket
  handleDisconnect(client: Socket) {
    console.log(`Usuario desconectado ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('entrar_chat')
  async entrarAlChat(cliente: Socket, idChat: string){
     cliente.join(idChat);
     console.log('el usuario entro al chat', idChat);
     console.log('salas del cliente:', cliente.rooms);
     console.log('Cliente entró a la sala:', idChat);
     console.log('Salas activas del cliente:', cliente.rooms);
     console.log('entrar_chat desde:', cliente.id);

     const mensajes = await this.chatService.getMessage(parseInt(idChat));
     cliente.emit('cargar_mensajes',mensajes)

  }

  @SubscribeMessage('enviar_mensaje')
  async enviarMensaje(cliente: Socket, mensajeCreate: MensajeCreate){

    //guardar mensaje en la db
    const mensajeGuardado = await this.chatService.saveMassage(mensajeCreate);

    //traer mensaje con relaciones
    const nuevoMensaje = await this.chatService.mostaraMensajeNuevo(mensajeGuardado?.id)
    console.log('✉️ enviar_mensaje desde:', cliente.id);
    cliente.emit('evento_prueba');
    console.log(mensajeCreate)
    //mandar mensaje a los usuarios en el chat
    this.server.to(mensajeCreate.chat_id.toString()).emit('mensaje_recibido',nuevoMensaje);
  }
}
