import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankModule } from './bank-account/bank-account.module';
import { EmailModule } from './email/email.module';
import { SchedulerModule } from './scheduling/scheduling.module';

@Module({
  imports: [
    BankModule,
    MongooseModule.forRoot('mongodb://localhost:27017/tests'),
    EmailModule,
    SchedulerModule,
  ],
})
export class AppModule {}
