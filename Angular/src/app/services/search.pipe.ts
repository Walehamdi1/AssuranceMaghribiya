import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'advancedSearch',
  pure: false // Pour que le pipe réagisse aux changements dynamiques
})
export class AdvancedSearchPipe implements PipeTransform {
  transform(items: any[], searchText: string, fields: string[]): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item =>
      fields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchText)
      )
    );
  }
}
