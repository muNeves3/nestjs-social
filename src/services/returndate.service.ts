import { Injectable } from '@nestjs/common';

@Injectable()
export class ReturnDateService {
  returnDate(): Date {
    return new Date();
  }
}
