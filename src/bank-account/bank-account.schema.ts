import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankDocument = Document<Bank>;

@Schema({ timestamps: true })
export class Bank {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  balance: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  phoneNo?: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
BankSchema.set('collection', 'Banks');
