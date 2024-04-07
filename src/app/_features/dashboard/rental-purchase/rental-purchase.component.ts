import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { LoginService } from '../../login/service/login.service';
import { ModalService } from 'src/app/_core/service/modal.service';
// import { ForgotPasswordService } from '../../login/service/forgot-password.service';
// import { LogService } from 'src/app/_core/log/log.service';
// import { PreferenceService } from '../../profile/service/preference.service';
// import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
// import { User } from 'src/app/_shared/user/model/user';
// import { environment } from 'src/environments/environment';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { Router } from '@angular/router';
import { ShowService } from '../service/show.service';
import { StoreService } from 'src/app/_core/state/store.service';
import { LocationService } from '../../location/service/location.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mp-rental-purchase',
  templateUrl: './rental-purchase.component.html',
  styleUrls: ['./rental-purchase.component.scss']
})
export class RentalPurchaseComponent implements OnInit {

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
  isPurchased = new BehaviorSubject<boolean>(false);
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
  onPurchase() {
    this.modalService.hide();
this.showService.isPurchased.next(true);
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
