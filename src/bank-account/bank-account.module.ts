import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankController } from './bank-account.controller';
import { BankService } from './bank-account.service';
import { Bank, BankSchema } from './bank-account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bank.name,
        schema: BankSchema,
      },
    ]),
  ],
  providers: [BankService],
  controllers: [BankController],
  exports: [BankService],
})
export class BankModule {}
