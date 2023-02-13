import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/schemas/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './jwt-token/strategies';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Users.name, schema: UserSchema },
        ]),
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, AtStrategy, RtStrategy]
})
export class AuthModule {}
