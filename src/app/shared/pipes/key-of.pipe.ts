import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyOf',
  standalone: true
})
export class KeyOfPipe implements PipeTransform {
  transform(value: Record<string, any>): string {
    return value ? Object.keys(value)[0] || '' : '';
  }
} 