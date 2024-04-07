import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';

@Component({
  selector: 'mp-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  language: string;
  constructor(
      private translate: TranslateService,
      private storeService: StoreService
  ) {
      this.language = this.storeService.get(
          'moviepanda.language',
          StoreType.LOCAL
      );
      if (!this.language) {
          this.translate.setDefaultLang('English');
      } else {
          this.translate.setDefaultLang(this.language);
      }
  }

  ngOnInit(): void {
  }

}
