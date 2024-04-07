import { Component, OnInit, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'mp-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor() { }
  searchText: string;

  @Input()
  searchData: any;

  @Input()
  placeholder: any;

  @Input()
  searchField: any;
  @ContentChild("searchResultTemplate", { static: false })
  locationTemplateRef: TemplateRef<any>;
  ngOnInit(): void {

  }
}
