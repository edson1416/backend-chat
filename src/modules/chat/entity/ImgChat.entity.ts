import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatEntity } from './Chat.entity';

@Entity('img_mensajes')
export class ImgChatEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url_img: string;

  @Column()
  mensaje_id: number;

  @ManyToOne(()=>ChatEntity, chat => chat.imagenes, {onDelete:'CASCADE'})
  @JoinColumn({name: 'mensaje_id'})
  mensaje: ChatEntity;

  @CreateDateColumn()
  created_at: Date;
}