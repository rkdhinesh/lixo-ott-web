
import { WalletService } from '../../wallet/service/wallet.service';
import { Component, OnInit, ViewEncapsulation,Output, ChangeDetectorRef } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';


@Component({
  selector: "mp-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfileComponent implements OnInit {
 
  activeElem = "profile";
  

  @Output() changeTab = new EventEmitter();

  changeTabs: any;

  constructor(public cdRef: ChangeDetectorRef, private walletService:WalletService,private storeService: StoreService) { }

 
  ngOnInit(): void {
    // this.walletStatus();

  }
  walletStatus(){
    this.walletService.getWalletStatus();
      }
  public ngAfterViewInit() {
    this.changeTabs = this.storeService.get(
      'tabName',
      StoreType.LOCAL
    );
    this.tab(this.changeTabs);
    this.cdRef.detectChanges();

  }

  tab(nametab: any) {

    if (nametab === "profile") {
      this.activeElem = 'profile';
    }
    else if (nametab === "bookingHistory") {
      this.activeElem = 'bookingHistory';
    }

  }
  switchShow(viewname: any) {
    if (viewname === 'profile') {
        this.activeElem = 'profile';
    } if(viewname === 'preference'){
        this.activeElem = 'preference';
    }
    if(viewname === 'bookingHistory'){
      this.activeElem = 'bookingHistory';
    }
    if(viewname === 'wallet'){
      this.activeElem = 'wallet';
    }
}



}
