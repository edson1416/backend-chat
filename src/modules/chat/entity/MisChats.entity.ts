import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('mis_chats')
export class MisChatsEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  chat_id: number;

}
