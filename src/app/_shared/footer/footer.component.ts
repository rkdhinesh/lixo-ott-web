import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_core/service/modal.service';
import { VenueService } from 'src/app/_features/shows/service/venue.service';
import { BookingService } from '../booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { Subject } from 'rxjs';
import { ShowService } from 'src/app/_features/dashboard/service/show.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: "mp-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  activeElem = 'nowshowing';
  @ViewChild('venueTemplate', { static: false })
  venueTemplate: TemplateRef<any>;
  @ViewChild('filterTemplate', { static: false }) filterTemplate: TemplateRef<any>;
  city: string;
  booking: Booking;
  venueId: number;
  query: any;
  location: string;

  public fromDashboard: Subject<any> = new Subject<any>();
  loginForm: FormGroup;
  email: FormControl;

  modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-custom',
  };

  constructor(private router: Router,
    public venueService: VenueService,
    private modalService: ModalService,
    private storeService: StoreService,
    private bookingService: BookingService,
    public showService: ShowService,
    private formBuilder: FormBuilder,) { this.bookingService.get().subscribe(booking => this.booking = booking); }


  ngOnInit(): void {
    
    this.email = new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/),
        ]),
    )
        this.loginForm = this.formBuilder.group({
          email: this.email,
        });

    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.location = this.storeService.get(
      'moviepanda.location', StoreType.LOCAL);
    if (this.booking.fromVenue == true) {
      this.activeElem == 'venues';
    }
  }

  clearText(){
    this.query = '';
}

  switchShow(viewname: any) {
    if (viewname === 'nowshowing') {
      this.activeElem = 'nowshowing';
    } else if (viewname === 'upcoming') {
      this.activeElem = 'upcoming';
    }
    else if (viewname === 'venues') {
      this.openVenueModal();
    }
  }

  route() {
     this.router.navigate(['/']);
    if(this.router.url === '/'){
       document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }

  privacyPolicy() {
    this.router.navigate(["/privacypolicy"]);
  }
  termsandConditions() {
    this.router.navigate(["/termsandconditions"]);
  }
  faq() {
    this.router.navigate(["/faq"]);
  }
  contactus() {
    this.router.navigate(["/contactus"])
      .then(() => {
        window.location.reload();
      });
  }


  openVenueModal() {
    this.venueService.getVenuebyCity(this.location);
    this.modalService.show(this.venueTemplate, this.modalConfig);
  }
  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/']);
  }

  onVenueSelect(venueId: number, venueName: string, addressLine1: string, addressLine2: string) {
    this.venueId = venueId;
    this.booking = { ...this.booking, venueName };
    this.booking = { ...this.booking, venueId };
    this.booking = { ...this.booking, addressLine1 };
    this.booking = { ...this.booking, addressLine2 };
    this.booking = { ...this.booking, fromVenue: true };
    this.bookingService.update(this.booking);
    this.modalService.hide();
    if (this.router.url === '/') {
      window.location.reload();

    }
    else {
      this.reloadComponent();
    }


  }

  close() {
    if (undefined === this.booking.venueId) {
      this.activeElem = 'nowshowing';
    }
    this.modalService.hide();
  }
  goSubscribe(){
    if(this.loginForm.valid) {
    this.showService.emailSubscribe(this.loginForm.value.email);
    }else {
      return;
    }
  }
}