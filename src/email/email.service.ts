import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

type MailTransport = {
  sendMail: (options: MailOptions) => Promise<unknown>;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: MailTransport;

  constructor(private readonly configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    if (!emailUser || !emailPassword) {
      throw new Error('EMAIL_USER and EMAIL_PASSWORD must be configured');
    }

    const mailer = nodemailer as unknown as {
      createTransport: (options: {
        service: string;
        auth: { user: string; pass: string };
      }) => MailTransport;
    };

    this.transporter = mailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }

  async sendEmail(email: string, balance: number): Promise<void> {
    if (!email) {
      throw new Error('Email is required');
    }

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER') ?? '',
        to: email,
        subject: 'Your balance',
        text: `Your balance is ${balance}`,
      });
    } catch (error) {
      this.logger.error(
        `Error sending email to ${email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
