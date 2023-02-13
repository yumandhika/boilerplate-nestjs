import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';


export type UserDocument = Users & Document;
@Schema()
export class Users {
  @Prop({ unique: true, index: true, text: true })
  email: string;

  @Prop({ default : null, index: true })
  password: string;

  @Prop({ default : null })
  token: string;

  @Prop({ default : null })
  refresh_token: string;

  @Prop({ default : now })
  createdAt: Date;

  @Prop({ default : null })
  deletedAt: Date;

  @Prop({ default : now })
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(Users);

export {UserSchema};