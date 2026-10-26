import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { BankService } from './bank-account.service';
import { CreateDTO } from './dto/dto.createAccount';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/bank-account')
@ApiTags('Acounts')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('/create')
  @ApiOkResponse({ type: CreateDTO })
  @ApiOperation({ summary: 'Created' })
  async create(@Body() createDto: CreateDTO) {
    return await this.bankService.createAccount(createDto);
  }

  @Put('/deposit')
  @ApiOkResponse({ type: CreateDTO })
  @ApiOperation({ summary: 'Deposited' })
  async deposit(@Body() body: { email: string; amount: number }) {
    return await this.bankService.deposit(body.email, body.amount);
  }

  @Put('/withdraw')
  @ApiOkResponse({ type: CreateDTO })
  @ApiOperation({ summary: 'Withdraw' })
  async withdraw(@Body() body: { email: string; amount: number }) {
    return await this.bankService.withdraw(body.email, body.amount);
  }

  @Get('/balance')
  @ApiOkResponse({ type: CreateDTO })
  @ApiOperation({ summary: 'balance' })
  async getBalance(@Query('email') email: string) {
    return await this.bankService.getBalance(email);
  }
}
