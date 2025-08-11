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
import Any = jasmine.Any;

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  //al estar conectado al websocket
  handleConnection(client: Socket) {
    console.log(`Usuario conectado ${client.id}`);
    const idUsuario = client.handshake.query.idUsuario;
    if (idUsuario) {
      this.chatService.actualizarClienteSocketId(idUsuario, client.id);

      this.chatService
        .conexionUsuario(idUsuario)
        .then(async () => {
          console.log('Usuario conectado :D');
          const contadorMensajes =await this.chatService.contadorMensajesNoLeidos(idUsuario)
          console.log("mensajes no leidos",contadorMensajes)
          client.emit('mensajes_no_leidos',contadorMensajes)
          const miembros = await this.chatService.getMiembros(idUsuario);
          for (const miembro of miembros) {
            const socketId = miembro.cliente_socket_id;
            this.server.to(socketId).emit('estoy_conectado');
          }
        })
        .catch((error) => {
          console.log('Error al conectar: ', error);
        });
    }
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
  async entrarAlChat(cliente: Socket, idChat: string) {
    const idUsuario = cliente.handshake.query.idUsuario;
    cliente.join(idChat);
    console.log('el usuario entro al chat', idChat);
    await this.chatService.actualizarInChat(idUsuario,idChat, true);
    await this.chatService.entrarChat(idChat,idUsuario);
    const mensajes = await this.chatService.getMessage(parseInt(idChat));
    const usuarios = await this.chatService.getMiembrosChat(idChat);
    for (const usuario of usuarios) {
      const socketId = usuario.cliente_socket_id;
      this.server.to(socketId).emit('cargar_mensajes', mensajes);
    }
    //cliente.emit('cargar_mensajes',mensajes)
  }

  @SubscribeMessage('salir_chat')
  async salirDelChat(cliente: Socket, idChat: string){
    const idUsuario = cliente.handshake.query.idUsuario
    await this.chatService.actualizarInChat(idUsuario,idChat,false)
  }

  @SubscribeMessage('enviar_mensaje')
  async enviarMensaje(cliente: Socket, mensajeCreate: MensajeCreate) {
    //guardar mensaje en la db
    const mensajeGuardado = await this.chatService.saveMassage(mensajeCreate);

    //traer mensaje con relaciones
    const nuevoMensaje = await this.chatService.mostaraMensajeNuevo(
      mensajeGuardado?.id,
    );
    console.log('✉️ enviar_mensaje desde:', cliente.id);
    cliente.emit('evento_prueba');
    console.log(nuevoMensaje);
    //mandar mensaje a los usuarios en el chat
    this.server
      .to(mensajeCreate.chat_id.toString())
      .emit('mensaje_recibido', nuevoMensaje);
  }
}
