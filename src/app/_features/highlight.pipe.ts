import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }
  transform(searchData: any, searchText: string): any {
    if (!searchData) {
      return searchText;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(searchText, 'gi');
    const match = searchData.match(re);
    if (!match) {
      return searchData;
    }

    const value = searchData.replace(
      re, `<span  style='background-color:rgb(136, 136, 134)'>${match[0]}</span>`);
    return this._sanitizer.bypassSecurityTrustHtml(value);


  }

}
