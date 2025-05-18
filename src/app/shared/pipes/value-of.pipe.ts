import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueOf',
  standalone: true
})
export class ValueOfPipe implements PipeTransform {
  transform(value: Record<string, any>): any {
    return value ? Object.values(value)[0] || '' : '';
  }
} 