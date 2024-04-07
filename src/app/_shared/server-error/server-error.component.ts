import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { StoreService } from 'src/app/_core/state/store.service';

@Component({
    selector: 'mp-server-error',
    templateUrl: './server-error.component.html',
    styleUrls: ['./server-error.component.scss'],
})
export class ServerErrorComponent implements OnInit {
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

    ngOnInit(): void {}
}
