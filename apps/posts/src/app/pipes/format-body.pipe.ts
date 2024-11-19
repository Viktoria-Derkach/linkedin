import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class FormatBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value?.event?.date) {
      value.event.date = moment(value.event.date).toISOString();
    }
    return value;
  }
}
