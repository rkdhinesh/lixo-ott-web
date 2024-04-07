import {
    Component,
    OnInit,
    Output,
    EventEmitter,
} from '@angular/core';
import { LocationService } from '../service/location.service';
import { StoreService } from 'src/app/_core/state/store.service';
import { ShowService } from '../../dashboard/service/show.service';
import {
    BsModalRef,
} from 'ngx-bootstrap/modal/public_api';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_core/service/modal.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';

@Component({
    selector: 'mp-view-locations',
    templateUrl: './view-locations.component.html',
    styleUrls: ['./view-locations.component.scss'],
})
export class ViewLocationsComponent implements OnInit {
    locations: any;
    locationText: any;
    placeholder: string = 'Search for Cities';
    hidediv: boolean;
    location: any;
    searchField = 'name';
    modalRef: BsModalRef;
    query: any;
    constructor(
        public locationservice: LocationService,
        private modalService: ModalService,
        private storeService: StoreService,
        private showService: ShowService,
        private _routerObj: Router
    ) { }
    @Output() emitLocation: EventEmitter<any> = new EventEmitter();
    loader: boolean=true;
    cityresponse:any;
    ngOnInit(): void {
        this.locations = this.locationservice.getAllLocation();
        this.locationservice.location.subscribe((res)=>{
            this.cityresponse=res;
            this.loader=false;
        });
        this.location = this.storeService.get(
            'moviepanda.location',
            StoreType.LOCAL
        );
        if (this.location != null) {
            this.hidediv = true;
        }
    }
    close() {
        this.modalService.hide();
    }
    setLocation(location: any) {
        this.emitLocation.emit(location);
        this.locationText = this.storeService.put(
            'moviepanda.location',
            location,
            StoreType.LOCAL
        );
        this.showService.getNowShowingMovies(location);
        this._routerObj.navigate(['/'], {
            queryParams: {
                location: this.locationText,
            },
            queryParamsHandling: 'merge',
        });
        this.modalService.hide();
        if (this._routerObj.url === '/') {
            window.location.reload();
        } else {
            this.reloadComponent();
        }
    }
    reloadComponent() {
        this._routerObj.routeReuseStrategy.shouldReuseRoute = () =>
            false;
        this._routerObj.onSameUrlNavigation = 'reload';
    }
}
