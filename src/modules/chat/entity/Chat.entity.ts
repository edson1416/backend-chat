import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UsersEntity } from './Users.entity';
import { ImgChatEntity } from './ImgChat.entity';

@Entity('mensajes')
export class ChatEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: number;

  @Column()
  user_id: number;

  @ManyToOne(()=> UsersEntity, user => user.chats,{onDelete:'CASCADE'})
  @JoinColumn({name: 'user_id'})
  autor: UsersEntity;

  @Column()
  mensaje: string;

  @OneToMany(() => ImgChatEntity, img => img.mensaje)
  imagenes: ImgChatEntity[];

  @CreateDateColumn()
  created_at: Date;
}