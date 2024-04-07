import { Component, OnInit, TemplateRef,ViewChild } from "@angular/core";
import { PreferenceService } from "../service/preference.service";
import { ShowService } from "../../dashboard/service/show.service";
import { ModalService } from "src/app/_core/service/modal.service";
import { VenueService } from "../../shows/service/venue.service";
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';



@Component({
  selector: "mp-preference",
  templateUrl: "./preference.component.html",
  styleUrls: ["./preference.component.scss"],
})
export class PreferenceComponent implements OnInit {
  placeholder: string = "Search for Venues";
  searchField = "venueName";
  preferenceService: any;
  userPreferenceGenreId: number;
  indexPreference: any;
  DeleteVenueResponse: any;
  DeleteGenreResponse: any;
  switchtoVenue: boolean;
  switchtoRemoveVenue: boolean;
  venueId: number;
  deletedVenueId: number;
  userVenuePreferenceId: number;
  preferenceModels: Array<any>;
  isLoading = false;
  @ViewChild('venueTemplate', { static: false })
  venueTemplate: TemplateRef<any>;
  activeElem = 'nowshowing';
    city: string;
    booking: Booking;
    query: any;
    location:string;
  fromDashboard: any;

  modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-custom',
};
loader: boolean=true;
genresresponse:any;
preferenceVenue:any;
  constructor(
    public preference: PreferenceService,
    public showService: ShowService,
    private modalService: ModalService,
    public venueService: VenueService,
    private storeService: StoreService,
    private bookingService: BookingService,

  ) { }

  ngOnInit() {
    let city = this.storeService.get(
      'moviepanda.location', StoreType.LOCAL)
    this.venueService.getVenuebyCity(city);
    this.preference.venues.subscribe((res)=>{
      this.preferenceVenue=res;
      this.loader = false; 
    });
    this.preference.getPreferrdVenue();
    this.preference.getGenres();
    this.preference.genre.subscribe((res)=>{
      this.genresresponse=res;
      this.loader = false; 
      
    });
 
    this.fetchGenre();
  
  }

  fetchGenre() {  
    this.preference.getPreferredGenre(); 
  }

  addvenues(venueId: number) {
    this.preference.addPreferredVenue(venueId);
    this.preference.addvenueResponse.subscribe((res:any)=>{
      if(res.status.statusCode === "2001"){
        this.preference.getPreferrdVenue();
       
      }
    })
    
  }
  switchShow(viewname: any) {
    if (viewname === 'nowshowing') {
        this.activeElem = 'nowshowing';
    } else if(viewname === 'upcoming') {
        this.activeElem = 'upcoming';
    }
    else if (viewname ==='venues'){
        this.openVenueModal();
    }
}


  // check box select or unselect
  userSelectedGenre(event, genreId: number) {
    if (event.target.checked) {
      this.preference.addPreferedGenre(genreId);
    } else {
      this.preference.deletePreferredGenre(genreId);
    }
  }

  getCity(template: TemplateRef<any>) {
    this.modalService.show(template);
    let city = this.storeService.get(
      'moviepanda.location', StoreType.LOCAL);
    this.venueService.getVenuebyCity(city);
  }

  confirmDelete() {
    this.venueId = this.deletedVenueId;
    this.preference.deletePreferredVenue(this.venueId);
    this.switchtoRemoveVenue = false;
  }

  setvenues(venueId: number, i, template: TemplateRef<any>) {
    this.deletedVenueId = venueId;
    this.indexPreference = i;
    this.modalService.show(template);
  }

  hideVenue() {
    this.switchtoRemoveVenue = false;
  }

  hideModal() {
    this.modalService.hide();
  }
  openVenueModal(){
    this.modalService.show(this.venueTemplate, this.modalConfig);
    let locality = this.storeService.get(
      'moviepanda.location', StoreType.LOCAL);
        this.venueService.getVenuebyCity(locality);
    }


  onVenueSelect(venueId: number, venueName: string,addressLine1:string,addressLine2:string) {
    this.venueId = venueId;
    this.booking= {...this.booking, venueName};
    this.booking= {...this.booking, venueId};
    this.booking= {...this.booking, addressLine1};
    this.booking= {...this.booking, addressLine2};
    this.bookingService.update(this.booking);
    this.modalService.hide();
    this.fromDashboard.next(true);
    this.activeElem = 'venues';
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), 1000);
  }
   close() {
    this.modalService.hide();
  }

}

