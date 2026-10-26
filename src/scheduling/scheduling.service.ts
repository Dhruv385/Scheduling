import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Bank } from 'src/bank-account/bank-account.schema';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    @InjectModel(Bank.name) private readonly accountModel: Model<Bank>,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendDailyBalance(): Promise<void> {
    this.logger.log('Scheduled balance email job started');

    const users = await this.accountModel
      .find({}, { email: 1, balance: 1 })
      .lean();
    if (users.length === 0) {
      this.logger.log('No accounts found for scheduled email job');
      return;
    }

    const results = await Promise.allSettled(
      users.map(async (user) => {
        if (!user.email) {
          return;
        }

        this.logger.log(`Sending balance email to ${user.email}`);
        await this.emailService.sendEmail(
          user.email,
          Number(user.balance ?? 0),
        );
      }),
    );

    const failedCount = results.filter(
      (result) => result.status === 'rejected',
    ).length;
    if (failedCount > 0) {
      this.logger.warn(`Some balance emails failed: ${failedCount} account(s)`);
    }
  }
}
