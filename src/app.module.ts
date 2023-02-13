import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    ModulesModule,
  ],
})
export class AppModule {}
