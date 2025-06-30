import { Module } from '@nestjs/common';
import { ConexionModule } from './config/conexion/conexion.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [ConexionModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
