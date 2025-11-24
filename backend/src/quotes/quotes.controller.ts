import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto } from './dto';

@Controller('quotes')
@UseGuards(AuthGuard('jwt'))
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get()
  async getMyQuotes(@Request() req) {
    return this.quotesService.findByUserId(req.user.userId);
  }

  @Post()
  async createQuote(@Body() createQuoteDto: CreateQuoteDto, @Request() req) {
    return this.quotesService.create({
      ...createQuoteDto,
      user_id: req.user.userId,
    });
  }

  @Get(':id')
  async getQuote(@Param('id') id: number) {
    return this.quotesService.findById(id);
  }

  @Patch(':id')
  async updateQuote(@Param('id') id: number, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  async deleteQuote(@Param('id') id: number) {
    await this.quotesService.delete(id);
    return { message: 'Quote deleted successfully' };
  }
}
