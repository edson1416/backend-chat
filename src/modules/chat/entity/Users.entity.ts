import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { ChatEntity } from './Chat.entity';

@Entity('users')
export class UsersEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => ChatEntity, chat => chat.autor)
  chats: ChatEntity[];

  @Column()
  conectado: boolean;

  @Column()
  fecha_ultima_conexion:Date;

}