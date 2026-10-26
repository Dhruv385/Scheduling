import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Bank, BankSchema } from 'src/bank-account/bank-account.schema';
import { EmailModule } from 'src/email/email.module';
import { ScheduleService } from './scheduling.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bank.name,
        schema: BankSchema,
      },
    ]),
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class SchedulerModule {}
