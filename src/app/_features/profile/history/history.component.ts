import { Component, OnInit, TemplateRef} from "@angular/core";
import { ShowService } from "../../dashboard/service/show.service";
import { ProfileService } from "../service/profile.service";
import { ModalService } from "src/app/_core/service/modal.service";
import { ReservationService } from '../../booking/service/reservation.service';

@Component({
  selector: "mp-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
})
export class HistoryComponent implements OnInit {
  hidecancel: boolean = false;
  nullTicket: any;
  bookingHistoryModels: Array<any>;
  totalSeats: number;
  hideterms: boolean = true;
  hideView: boolean;
  showhide: any;
  activeElem = "less";
  bookingId: string;
  bookingReferenceId: string;
  loader: boolean=true;
  bookingHistoryDetails:any;
  constructor(
    public showService: ShowService,
    public profileService: ProfileService,
    private modalservice: ModalService,
    private modalService: ModalService,
    public reservationService: ReservationService,
  ) { }



  ngOnInit(): void { 
    this.fetchBookinghistory();
  }
  
  fetchBookinghistory() {
    this.profileService.getBookingHistory();
    this.profileService.bookingHistory.subscribe((res:any)=>{
      this.bookingHistoryDetails=res;
      this.hidecancel = true;
      this.loader = false;  
    })
  }

  cancelBooking(showVenueterms: TemplateRef<any>, venue_id: number) {
    this.profileService.retrievingTerms(venue_id);
    this.profileService.bookingCancellationTerms();
    this.modalservice.show(showVenueterms);
  }
  bookingVenueTerms(bookingReference: string, venue_id: number) {
    this.profileService.getRefundAmount(bookingReference, venue_id);
    this.hideterms = false;
  }

  refundAmount(historyModel) {
    this.profileService.cancelBooking(historyModel.bookingReference, historyModel.venue_id);
    this.modalservice.hide();
  }

  hideModal() {
    this.modalservice.hide();
  }

  //less details and more details values
  show() {

    if (this.activeElem === "less") {
      this.activeElem = "more";
      this.showhide = true;

    } else {
      this.activeElem = "less";
      this.showhide = false;
    }
  }
  //show hide the details name
  hideshows() {
    this.showhide = true;
  }
  openModals(selectLocation: TemplateRef<any>) {
    let config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'my-modal modal-dialog-centered',
    };
    this.modalService.show(selectLocation, config);
  }
  openModal(selectbooking: TemplateRef<any>, historyModel) {
    this.modalService.show(selectbooking);
    this.bookingId = historyModel.booking_id;
    this.bookingReferenceId = historyModel.bookingReference;
    this.reservationService.getTicketDetails(this.bookingId, this.bookingReferenceId);
  }

  close() {
    this.modalService.hide();
  }

}


