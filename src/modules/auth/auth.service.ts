import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from "argon2";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, Users } from 'src/schemas/users.schema';
import { JwtPayload, Tokens } from './jwt-token/payload';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
    ){}

  async argonHashing(data:string) {
    return await argon2.hash(data);
  }

  async argonVerify(userToken, password) {
    return await argon2.verify(userToken, password);
  }

  async createUser(data, token) {
    try {

      let createUser = await this.userModel.create({
        email:data.email,
        password:data.password,
        token: token
      });

      return createUser

    } catch (e) {
      Logger.error("[AUTH][SERVICE][CREATE][USER]:", e);
      return null
    }
  }

  async findUserByEmail(email:string){
    try {
      const user:any = await this.userModel.findOne({email: email}).collation( { locale:'en', strength: 1 } ).lean().exec();
      return user;
    } catch(e){
      Logger.error("[AUTH][SERVICE][FIND][USER-EMAIL]:", e);
      return null
    }
  }
  
  async updateRtHash(userId: any, rt: string): Promise<void> {
    try {
      const hash = await argon2.hash(rt);
      return await this.userModel.findByIdAndUpdate(
        userId, {
          refresh_token: hash
        }
      )
    } catch (e) {
      Logger.error("[AUTH][SERVICE][UPDATE][USER-REFRESH-TOKEN]:", e);
      return null
    }
  }

  async updateRtHashToNull(userId: any): Promise<void> {
    try {
      return await this.userModel.findByIdAndUpdate(
        userId, {
          refresh_token: null
        }
      )
    } catch (e) {
      Logger.error("[AUTH][SERVICE][UPDATE][USER-REFRESH-TOKEN]:", e);
      return null
    }
  }

  async getTokens(userId: any, email: string): Promise<Tokens> {
    try {
      const jwtPayload: JwtPayload = {
        sub: userId,
        email: email,
      };
  
      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: '15m',
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: '7d',
        }),
      ]);
  
      return {
        access_token: at,
        refresh_token: rt,
      };
    } catch (e) {
      Logger.error("[AUTH][SERVICE][GET][USER-TOKEN]:", e);
      return null
    }
  }
}
