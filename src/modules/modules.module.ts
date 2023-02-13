import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Users.name, schema: UserSchema },
    ]),
    AuthModule,
    JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
})
export class ModulesModule {}
