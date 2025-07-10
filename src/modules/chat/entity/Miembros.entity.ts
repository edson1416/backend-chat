import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('miembros_chats')
export class MiembrosEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  chat_id: number;

  @Column()
  cliente_socket_id: string;

  @Column()
  in_chat: boolean;

}