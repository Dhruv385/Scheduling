import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank } from './bank-account.schema';
import { CreateDTO } from './dto/dto.createAccount';

@Injectable()
export class BackAccountService {
  constructor(
    @InjectModel(Bank.name) private readonly accountModel: Model<Bank>,
  ) {}

  async createAccount(createDto: CreateDTO): Promise<Bank> {
    const email = createDto.email.trim().toLowerCase();

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const existing = await this.accountModel.findOne({ email });
    if (existing) {
      throw new ConflictException('Account already exists');
    }

    return this.accountModel.create({
      email,
      name: createDto.name.trim(),
      balance: Number(createDto.balance ?? 0),
    });
  }

  async deposit(email: string, amount: number): Promise<Bank> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const account = await this.accountModel.findOne({ email: normalizedEmail });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.balance = Number(
      (Number(account.balance ?? 0) + amount).toFixed(2),
    );
    return account.save();
  }

  async withdraw(email: string, amount: number): Promise<Bank> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const account = await this.accountModel.findOne({ email: normalizedEmail });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const currentBalance = Number(account.balance ?? 0);
    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    account.balance = Number((currentBalance - amount).toFixed(2));
    return account.save();
  }

  async getBalance(email: string): Promise<{ balance: number }> {
    const normalizedEmail = email.trim().toLowerCase();
    const account = await this.accountModel.findOne({ email: normalizedEmail });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return { balance: Number((account.balance ?? 0).toFixed(2)) };
  }
}
