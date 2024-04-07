import { Component, OnInit, ElementRef, ViewChild, TemplateRef, NgZone, HostListener } from "@angular/core";
import { Order } from "../model/order";
import { ModalService } from "src/app/_core/service/modal.service";
import { PaymentService } from "../service/payment.service";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ShowService } from "../../dashboard/service/show.service";
import { Router } from "@angular/router";
import { IMovie, Movie } from "../../shows/model/movie";
import { MovieStateService } from "src/app/_shared/movie/service/movie-state.service";
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from '../../../_core/constants/store-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { User } from 'src/app/_shared/user/model/user';
import { WalletService } from '../../wallet/service/wallet.service';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { ExternalLibraryService } from '../seat-layout/util';
import { ChangeDetectorRef } from '@angular/core';
import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Seat } from "src/app/_shared/booking/ model/seat-layout";

declare let Razorpay: any;

@Component({
  selector: "mp-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.scss"],
})
export class SummaryComponent implements OnInit {
  @ViewChild("myFormPost") myFormPost: ElementRef;
  movie$: Observable<IMovie>;
  movie: Movie;
  user: User;
  disablePaymentButton: Boolean = true;
  loginform: FormGroup;
  bookinId: any;
  paymentToken: any;
  location: string;
  movieName: string;
  venueName: string;
  language: string;
  selectedDate: string;
  showTime: string;
  isFirstOpen: boolean = true;
  order = new Order();
  summayform: FormGroup;
  email: FormControl;
  payment: FormGroup;
  number: FormControl;
  ticketTotal: number;
  walletBalance: number;
  errorMsg: String;

  confirmWallet: boolean;
  makeRecharge: boolean;
  bookingReferenceId: string;
  bookingId: string;
  errorMsgs: string;
  paymentModeRes: any[];
  payModes: any;
  navi = "Ticket Not Available"
  confirmPaymentFlag = true;
  defaultMode: number = 1;
  submitted = false;
  primaryNumber: string;
  primaryEmail: string;
  profileMsg: string = "Please Enter Required Fields";
  booking: Booking;
  response;
  razorpayResponse;
  showModal = false;
  fareResponse: any;
  totalAmount: any;
  ticketFare: any;
  handlingCharges: any;
  moreDetails: boolean = false;
  isLoading = false;
  toggle: boolean = false;

  totalTicketFare: any;
  baseFare: any;
  extraFare: any;
  discountFare: any;
  taxAmount: any;
  taxAmounts: any;
  taxName: any;
  taxNames: any;
  chargeName: any;
  chargeAmount: any;
  taxesName: any;
  taxesAmount: any;
  taxValue = new Array();
  taxValueAmount = new Array();
  totalSeatsBooked: any;
  seatNumber: any;
  seatObj = new Array();
  chargeTaxName: any;
  chargeTaxAmount: any;
  paymodeId: number;

  loader: boolean = true;
  classPublishedId: number;
  selectedSeats = new Array<Seat>();
  aa: any;
  @ViewChild("wallet") walletModal: TemplateRef<any>;
  error_messages = {
    number: [{ type: "required", message: "PhoneNumber must be 10 digit." }]
  };
  text: any;
  @ViewChild('errorPopup', { static: true }) errorPopup: TemplateRef<any>;

  modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-custom',
  };

  constructor(
    public paymentService: PaymentService, public userService: UserService, public walletService: WalletService,
    public showService: ShowService, private modalService: ModalService,
    private router: Router, private translate: TranslateService, private storeService: StoreService,
    public movieStateService: MovieStateService, fb: FormBuilder,
    private bookingService: BookingService, private razorpayService: ExternalLibraryService, private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    // this.router.events
    // .subscribe((event: NavigationStart) => {
    //   if (event.navigationTrigger === 'popstate') {
    //     // Perform actions
    //     console.log("from copnent")
    //     // this.modalService.show(this.filterTemplate, this.modalConfig);
    //   }
    // });

    this.summayform = fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/
          )
        ])
      ],
      number: ['', [Validators.required,
      Validators.pattern("^[0-9_-]{10}"),
      Validators.minLength(10), Validators.maxLength(10)]]
    });
    this.bookingService.get().subscribe(booking => this.booking = booking);
  }
  get f() { return this.summayform.controls; }

  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log("Back button pressed" + event);
    if (this.paymentService.blockStatus) {
      this.paymentService.seatUnblockingStatus();
      this.paymentService.unBlockStatus.subscribe((response: any) => {
        if (response.status.statusCode === "1001") {
          window.location.reload();
        }
      })
    } else {
      window.location.reload();
    }
  }



  navigateToHome() {
    this.router.navigate(['/'])
    this.modalService.hide();
  }


  ngOnInit(): void {
    // this.razorpayService
    //   .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    //   .subscribe();



    this.language = this.storeService.get(
      'moviepanda.language',
      StoreType.LOCAL
    );

    // this.booking.paymentMode = this.defaultMode;
    if (!this.language) {
      this.translate.setDefaultLang("English");
    }
    else {
      this.translate.setDefaultLang(this.language);
    }

    this.userService.getUser().subscribe((users) => {
      this.user = users[0];
    });
    this.primaryEmail = this.storeService.get(
      'primaryEmail',
      StoreType.LOCAL
    );
    this.primaryNumber = this.storeService.get(
      'primaryPhoneNumber',
      StoreType.LOCAL
    );

    if (undefined != this.user && this.user.isLoggedIn === true) {

      if (this.primaryEmail === "undefined") {
        this.order.customerEmail = '';

      }
      else {
        this.order.customerEmail = this.primaryEmail;
      }
      if (this.primaryNumber === "undefined") {

        this.order.customerPhone = '';


      }
      else {

        this.order.customerPhone = this.primaryNumber;
      }

    } else {
      this.order.customerEmail = '';
      this.order.customerPhone = '';
    }
    this.selectedDate = this.booking.showDate;
    this.showTime = this.booking.showTime;
    if (this.selectedDate === undefined && this.storeService.get('ticketFare', StoreType.LOCAL) === null) {
      this.modalService.show(this.errorPopup);

    }
    else {
      console.log("failure");
    }
    this.paymentService.paymentMode();
    setTimeout(() => (this.loader = false), 2000);

    if (this.booking.onSummary == true) {

      this.paymentService.fareDetils.subscribe((res) => {
        // this.loader=false;
        this.fareResponse = res;
        this.ticketFare = this.fareResponse.totalTicketFare;
        this.handlingCharges = this.fareResponse.handlingCharges;
        this.totalAmount = this.fareResponse.totalTicketAmount;
        this.storeService.put("ticketFare", this.fareResponse.totalTicketFare, StoreType.LOCAL);
        this.storeService.put("handlingCharges", this.fareResponse.handlingCharges, StoreType.LOCAL);
        this.storeService.put("totalAmount", this.fareResponse.totalTicketAmount, StoreType.LOCAL);
        this.baseFare = this.fareResponse.fareResponseDetails.baseFare;
        this.extraFare = this.fareResponse.fareResponseDetails.extraFare;
        this.discountFare = this.fareResponse.fareResponseDetails.discountFare;
        this.chargeAmount = this.fareResponse.fareResponseDetails.charges.chargeAmount;
        this.totalSeatsBooked = this.fareResponse.totalSeatsBooked;



        for (let seatses of this.fareResponse.seats) {

          this.seatObj.push(seatses);
          this.storeService.put("seatNumber", JSON.stringify(this.seatObj), StoreType.LOCAL);
          this.seatNumber = JSON.parse(this.storeService.get("seatNumber", StoreType.LOCAL));

        }
        this.storeService.put("totalSeatsBooked", this.totalSeatsBooked, StoreType.LOCAL);
        this.totalSeatsBooked = this.storeService.get("totalSeatsBooked", StoreType.LOCAL);


        let taxxx = this.fareResponse.fareResponseDetails;
        for (let tax of taxxx.taxes) {
          // if (tax.taxAmount != 0)
          {
            // this.taxesName=tax.taxName;
            this.taxValue.push(tax.taxName);
            this.taxValueAmount.push(tax.taxAmount);
            // this.taxAmount=tax.taxAmount; 
            this.storeService.put("taxName1", this.taxValue[0], StoreType.LOCAL);
            this.storeService.put("taxName2", this.taxValue[1], StoreType.LOCAL);
            this.taxName = this.storeService.get('taxName1', StoreType.LOCAL);
            this.taxNames = this.storeService.get('taxName2', StoreType.LOCAL);
            //  this.taxesAmount=tax.taxAmount;
            this.storeService.put("taxAmount1", this.taxValueAmount[0], StoreType.LOCAL);
            this.storeService.put("taxAmount2", this.taxValueAmount[1], StoreType.LOCAL);
            this.taxAmount = this.storeService.get('taxAmount1', StoreType.LOCAL);
            this.taxAmounts = this.storeService.get('taxAmount2', StoreType.LOCAL);

          }
        }
        if (this.taxValue[0] && this.taxValue[1]) {
          console.log("Both Taxes available");
        } else {
          this.taxNames = "";
          this.taxAmounts = "";
        }

        for (let charges of taxxx.charges) {
          if (charges.chargeAmount != 0) {
            this.chargeName = charges.chargeName;
            this.storeService.put("chargeName", this.chargeName, StoreType.LOCAL);
            this.chargeName = this.storeService.get('chargeName', StoreType.LOCAL);
            this.chargeAmount = charges.chargeAmount;
            this.storeService.put("chargeAmount", this.chargeAmount, StoreType.LOCAL);
            this.chargeAmount = this.storeService.get('chargeAmount', StoreType.LOCAL);
            for (let chargeTax of charges.taxes) {
              this.chargeTaxName = chargeTax.taxName;
              this.chargeTaxAmount = chargeTax.taxAmount;
              this.storeService.put("chargeTaxName", this.chargeTaxName, StoreType.LOCAL);
              this.storeService.put("chargeTaxAmount", this.chargeTaxAmount, StoreType.LOCAL);
              this.chargeTaxName = this.storeService.get('chargeTaxName', StoreType.LOCAL);
              this.chargeTaxAmount = this.storeService.get('chargeTaxAmount', StoreType.LOCAL);
            }
          }
        }

        this.storeService.put("ticketFare", this.fareResponse.totalTicketFare, StoreType.LOCAL);
        this.storeService.put("handlingCharges", this.fareResponse.handlingCharges, StoreType.LOCAL);
        this.storeService.put("totalAmount", this.fareResponse.totalTicketAmount, StoreType.LOCAL);
        this.storeService.put("totalTicketFare", this.fareResponse.totalTicketFare, StoreType.LOCAL);
        this.storeService.put("baseFare", this.fareResponse.fareResponseDetails.baseFare, StoreType.LOCAL);
        this.storeService.put("extraFare", this.fareResponse.fareResponseDetails.extraFare, StoreType.LOCAL);
        this.storeService.put("discountFare", this.fareResponse.fareResponseDetails.discountFare, StoreType.LOCAL);
        this.storeService.put("totalSeatsBooked", this.fareResponse.totalSeatsBooked, StoreType.LOCAL);
        this.storeService.put("seatNumber", JSON.stringify(this.seatObj), StoreType.LOCAL);
        this.storeService.put("chargeTaxName", this.chargeTaxName, StoreType.LOCAL);
        this.storeService.put("chargeTaxAmount", this.chargeTaxAmount, StoreType.LOCAL);
        this.storeService.put("taxName1", this.taxValue[0], StoreType.LOCAL);
        this.storeService.put("taxName2", this.taxValue[1], StoreType.LOCAL);
        this.storeService.put("taxAmount1", this.taxValueAmount[0], StoreType.LOCAL);
        this.storeService.put("taxAmount2", this.taxValueAmount[1], StoreType.LOCAL);

      });
      this.booking = { ...this.booking, onSummary: false };
      this.bookingService.update(this.booking);
    } else {

      this.ticketFare = this.storeService.get('ticketFare', StoreType.LOCAL);
      this.handlingCharges = this.storeService.get('handlingCharges', StoreType.LOCAL);
      this.totalAmount = this.storeService.get('totalAmount', StoreType.LOCAL);
      this.totalTicketFare = this.storeService.get('totalTicketFare', StoreType.LOCAL);
      this.baseFare = this.storeService.get('baseFare', StoreType.LOCAL);
      this.extraFare = this.storeService.get('extraFare', StoreType.LOCAL);
      this.discountFare = this.storeService.get('discountFare', StoreType.LOCAL);
      // this.taxAmount=this.storeService.get('taxAmount',StoreType.LOCAL);
      // this.taxName=this.storeService.get('taxName',StoreType.LOCAL);
      this.chargeAmount = this.storeService.get('chargeAmount', StoreType.LOCAL);
      this.chargeName = this.storeService.get('chargeName', StoreType.LOCAL);
      this.totalSeatsBooked = this.storeService.get('totalSeatsBooked', StoreType.LOCAL);
      this.seatNumber = JSON.parse(this.storeService.get("seatNumber", StoreType.LOCAL));
      this.chargeTaxName = this.storeService.get('chargeTaxName', StoreType.LOCAL);
      this.chargeTaxAmount = this.storeService.get('chargeTaxAmount', StoreType.LOCAL);
      this.taxName = this.storeService.get('taxName1', StoreType.LOCAL);
      this.taxNames = this.storeService.get('taxName2', StoreType.LOCAL);
      this.taxAmount = this.storeService.get('taxAmount1', StoreType.LOCAL);
      this.taxAmounts = this.storeService.get('taxAmount2', StoreType.LOCAL);

    }

    //TODO Need to use when callig wallet service
    // this.walletService.getWalletStatus();
    // this.walletService.walletStatus.subscribe((res: any) => {
    //   this.walletBalance = res.balance;
    // })
    this.movie$ = this.movieStateService.getMovie(
      this.booking.movieId
    );
    this.movie$.subscribe((movie) => (this.movie = movie[0]));

    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern(
        /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/
      )
    ]);
    this.number = new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]{0-10}")
    ]);
    this.payment = new FormGroup({
      email: this.email,
      number: this.number
    });
    this.bookingService.update(this.booking);
  }

  paymentType(paymentMode: number, login: TemplateRef<any>) {
    // this.booking.paymentMode = paymentMode;
    this.booking = { ...this.booking, paymentMode: paymentMode };
    this.bookingService.update(this.booking);
    if (paymentMode === 2) {
      this.confirmWallet = true;
    }
    else {
      this.confirmWallet = false;
    }
    this.userService.getUser().subscribe((users) => {
      this.user = users[0];
    });


    if (this.user.isLoggedIn === true) {
      if (paymentMode === 2) {
        this.ticketTotal = this.booking.ticketTotal;
        if (this.walletBalance < this.ticketTotal) {
          this.makeRecharge = false
        }
        else if (this.walletBalance > this.ticketTotal)
          this.makeRecharge = true;
      }

    }
    else {
      this.modalService.show(login);
    }
  }
  confirmWalletPayment() {
    // if(this.walletBalance > this.ticketTotal){
    this.order.customerName = this.order.customerEmail;
    this.walletService.confirmWalletPayment(this.order);
    this.walletService.walletPayment.subscribe((res: any) => {

      this.bookingReferenceId = res.bookingReferenceId;
      this.bookingId = res.bookingId
      if (res.status.statusCode === "1001") {
        this.router.navigate(['/ticketconfirmation'], { queryParams: { bookingReferenceId: this.bookingReferenceId, bookingId: this.bookingId } });
      }
      else {
        this.errorMsgs = this.navi;
      }
    })

    // }

  }

  confirmPayment() {
    this.storeService.put("customerEmail", this.order.customerEmail, StoreType.LOCAL);
    this.storeService.put("customerPhone", this.order.customerPhone, StoreType.LOCAL);
    this.confirmPaymentFlag = false;
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), 4000);
    this.submitted = true;
    this.paymentService.paymentMode();
    this.booking = { ...this.booking, paymentMode: this.defaultMode };
    this.paymentService.paymentModes.subscribe((response: any) => {
      this.paymentModeRes = response;
      this.paymentModeRes.forEach(payMode => {
        if (payMode.priority == 1) {
          this.payModes = payMode.modeName;
          this.paymodeId = payMode.id;
        }
      });
      if (this.payModes === 'RAZORPAY') {
        this.order.customerName = this.order.customerEmail;
        this.order.paymentMode = this.paymodeId;

        this.paymentService.connectRazorPay(this.order);
        this.paymentService.payment.pipe(take(1)).subscribe((response) => {

          this.order = response;
          this.payWithRazor();
        });
      } else if (this.payModes === 'CASHFREE') {
        this.order.customerName = this.order.customerEmail;
        this.paymentService.connectCashFree(this.order);
        this.paymentService.payment.subscribe((response) => {
          this.order = response;
          if (this.order.hash !== null) {
            setTimeout(() => {
              this.myFormPost.nativeElement.submit();
            }, 1);
          }
        });
      }
      else {
        return;
      }


    });

  }
  payWithRazor() {
    const RAZORPAY_OPTIONS: any = {
      "key": this.order.key,
      "order_id": this.order.razorpayOrderId,
      "amount": this.order.orderAmount,
      "currency": this.order.customerCurrency,
      "name": "MOVIE PANDA",
      "image": "assets/images/img/logo.svg",

      "prefill": {
        "name": this.order.customerName,
        "email": this.order.customerEmail,
        "contact": this.order.customerPhone
      },

      "modal": {},
      "theme": {
        "color": "#272b37"
      }

    };
    // RAZORPAY_OPTIONS.amount = 2000,
    let rzp;
    RAZORPAY_OPTIONS['modal.ondismiss'] = this.razorpayReload.bind(this);
    RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
    this.ngZone.runOutsideAngular(() => { rzp = new this.razorpayService.nativeWindow.Razorpay(RAZORPAY_OPTIONS); rzp.open(); }
    );
  }

  public razorpayReload() {
    window.location.reload();
  }



  public async razorPaySuccessHandler(response) {
    console.log("razor ppay syccess handler");
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges();
    document.getElementById('razorpay-response').style.display = 'block';
    this.razorpayResponse = response;
    console.log("Response", JSON.stringify(response.razorpay_payment_id));
    console.log("method", JSON.stringify(response))
    this.storeService.put("razorpay_order_id", response.razorpay_order_id, StoreType.LOCAL);
    this.storeService.put("razorpay_payment_id", response.razorpay_payment_id, StoreType.LOCAL);
    this.storeService.put("razorpay_signature", response.razorpay_signature, StoreType.LOCAL);

    this.paymentService.getRazorpayPaymentDetail();
    let routeToConfirmation = false;
    this.paymentService.razorPayment.pipe(
      finalize(() => {
        console.log("finalize method called" + routeToConfirmation);
        if (routeToConfirmation) {
          this.ngZone.run(() =>
            this.router.navigate(['/ticketconfirmation'], { queryParams: { bookingReferenceId: this.bookingReferenceId, bookingId: this.bookingId } }).then(() => {
              window.location.reload();
            }))
        }
      }),
    ).subscribe((res: any) => {
      this.bookingReferenceId = res.bookingReferenceId;
      this.bookingId = res.bookingId
      if (res.status.statusCode === "1001") {
        routeToConfirmation = true;
        console.log('completing the payment details');
        this.paymentService.razorPayment.complete();
      }
      else {
        this.errorMsgs = this.navi;
        routeToConfirmation = false;
      }
    });
  }


  //seat status 
  unBlockSeatStatus() {
    if (this.paymentService.blockStatus) {
      this.paymentService.seatUnblockingStatus();
      this.paymentService.unBlockStatus.subscribe((response: any) => {
        if (response.status.statusCode === "1001") {
          this.router.navigate(['/booking']);
        }
      })
    } else {
      this.router.navigate(['/booking']);
    }
  }



  ngOnDestroy() {
    console.log("I am on Destroy ");
    this.storeService.delete('ticketFare', StoreType.LOCAL);
    this.storeService.delete('handlingCharges', StoreType.LOCAL);
    this.storeService.delete('totalAmount', StoreType.LOCAL);
    this.storeService.delete('totalTicketFare', StoreType.LOCAL);
    this.storeService.delete('baseFare', StoreType.LOCAL);
    this.storeService.delete('extraFare', StoreType.LOCAL);
    this.storeService.delete('discountFare', StoreType.LOCAL);
    this.storeService.delete('taxAmount1', StoreType.LOCAL);
    this.storeService.delete('taxAmount2', StoreType.LOCAL);
    this.storeService.delete('taxName1', StoreType.LOCAL);
    this.storeService.delete('taxName2', StoreType.LOCAL);
    this.storeService.delete('chargeAmount', StoreType.LOCAL);
    this.storeService.delete('totalSeatsBooked', StoreType.LOCAL);
    this.storeService.delete('seatNumber', StoreType.LOCAL);
    this.storeService.delete('chargeTaxName', StoreType.LOCAL);
    this.storeService.delete('chargeTaxAmount', StoreType.LOCAL);

  }
  close() {
    this.moreDetails = false;
  }
  showMoreDetails() {
    if (this.moreDetails === true) {
      this.moreDetails = false;
    } else {
      this.moreDetails = true;
    }
  }
  doToggle(): void {
    this.toggle = !this.toggle;
  }

}
