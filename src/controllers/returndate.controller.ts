import { Controller, Get } from '@nestjs/common';
import { ReturnDateService } from '../services/returndate.service';

@Controller('returndate')
export class ReturnDateController {
  constructor(private readonly returndateserevice: ReturnDateService) {}

  @Get()
  returnDate(): Date {
    return this.returndateserevice.returnDate();
  }
}
