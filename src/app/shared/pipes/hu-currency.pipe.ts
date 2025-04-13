import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'huCurrency'
})
export class HuCurrencyPipe implements PipeTransform {

  transform(value: number | undefined, ...args: unknown[]): unknown {
    if (value === undefined) {
      return '';
    }

    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedValue} Ft`;
  }

}
