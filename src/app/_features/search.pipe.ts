import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // tslint:disable-next-line: ban-types
  filterResults: Array<Object>;
  searchResults: Array<any> = null;

  transform(searchData: any[], searchText: string, searchField: string): any[] {
    if (!searchData) {
      return [];
    }
    if (!searchText) {
      return searchData;
    }
    searchText = searchText.toLowerCase();
    this.filterResults = searchData.filter((it) => {
      return it[searchField].toString().toLowerCase().includes(searchText);
    });
    if (this.filterResults.length > 0) {
      return this.filterResults;
    } else {
      this.searchResults = [{ name: "No Results Found", success: false}];
      return this.searchResults;
    }
  }

}
