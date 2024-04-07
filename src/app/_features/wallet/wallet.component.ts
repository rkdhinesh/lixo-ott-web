import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { WalletService } from './service/wallet.service';
import { ModalService } from 'src/app/_core/service/modal.service';
import { LoginService } from '../login/service/login.service';
import { User } from 'src/app/_shared/user/model/user';
import { Kyc} from './model/enrollment';
import { Order } from '../booking/model/order';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { StoreService } from 'src/app/_core/state/store.service';
import { ProfileService } from '../profile/service/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mp-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  updateMsg: string = "update number";
  wallet: boolean = true;
  enrollmentStatus: any;
  accountNumber: string;
  timeLeft: number = 60;
  timer: boolean;
  updateNumber: boolean;
  settimer: boolean;
  enrollments: boolean;
  interval;
  passwordOtp: boolean;
  otp: string;
  kycUpload: boolean;
  terms: boolean = false;
  myFiles: string[] = [];
  user: User = new User()
  walletValue: Array<Kyc>;
  kyc: Kyc = new Kyc;
  primaryNumber: string;
  order = new Order();
  @ViewChild("myFormPost") myFormPost: ElementRef;
  @ViewChild("updatenumber") updateNumberModal: TemplateRef<any>;
  constructor(public walletService: WalletService, private modalService: ModalService, private loginService: LoginService,
    private storeService: StoreService, private profileService: ProfileService, private _router: Router) { }

  ngOnInit(): void {
    this.wallet = false;
    this.enrollments = true;


    this.walletService.getWalletStatus();
    this.walletService.walletStatus.subscribe((walletStatus: any) => {
      if (walletStatus.status == 404 || walletStatus.status == !undefined) {
        this.enrollments = true;
        this.wallet = true;
      }
      else if (walletStatus.status == undefined) {
        this.wallet = false;
        this.enrollments = false;
        this.walletService.walletDetails();
      }
    })


    this.primaryNumber = this.storeService.get(
      'primaryPhoneNumber',
      StoreType.LOCAL
    );

    if (this.primaryNumber === "undefined" || this.primaryNumber === "null") {
      // this.updateNumber = true;

    }
    else {
      this.accountNumber = this.primaryNumber;
    }
  }
  getFileDetails(e) {

    // for(let x of val){
    //   console.log("for"+x.File.name)
    // }

    // console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);


    }

  }


  openModal(enrollmentModal: TemplateRef<any>) {
    if (this.primaryNumber === "undefined" || this.primaryNumber === "null") {
      this.modalService.show(this.updateNumberModal);
    }
    else {
      this.modalService.show(enrollmentModal);
    }
  }


  confirmAccountNumber() {
    this.loginService.intiateOtp(this.accountNumber);
    this.passwordOtp = true;
  }

  updatePrimaryNumber() {
    this.user.primaryPhoneNumber = this.accountNumber;
    this.profileService.updatePrimaryNumber(this.user);
    this.profileService.updatedPrimaryNumber.subscribe((updateNumber: any) => {
      if (updateNumber.status.statusCode === "2001") {
        this.modalService.hide();
        this.profileService.getProfile(this.user)
        this._router.navigate(['/profile']);
      }
    })
  }

  async authenticateOtp() {
    this.user.userId = this.accountNumber;
    this.user.passCode = this.otp;
    this.loginService.authenticateOtp(this.user);
    this.loginService.walletOtp.subscribe((authenticateOtp: any) => {
      if (authenticateOtp.status.statusCode === "1001") {
        this.modalService.hide();
        this.enrollments = false;
        this.kycUpload = true;
      }
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 30;
        clearInterval(this.interval);
        this.timer = true;
        this.settimer = false;
      }
    }, 1000);
  }

  acceptanceFlag() {
    this.terms = !this.terms;
  }


  enrollmentClick() {
    this.walletService.walletEnrollment(this.terms, this.myFiles,this.accountNumber);
    this.wallet = false;
    this.kycUpload = false;
  
  }


  unEnrollment() {
    this.walletService.walletUnenrollment();
  }


  confirmPayment() {
    this.walletService.walletRecharge(this.order.orderAmount);
    this.walletService.walletRechargeResponse.subscribe((response: any) => {
      this.order = response;
      if (this.order.hash !== null) {
        setTimeout(() => {
          this.myFormPost.nativeElement.submit();
        }, 5000);
      }
    })
  }
}
