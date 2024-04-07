import { Component, OnInit, TemplateRef, Output, EventEmitter } from "@angular/core";
import { ModalService } from "src/app/_core/service/modal.service";
import { Router } from "@angular/router";
import { ShowTimeService } from "../service/show-time.service";
import { ShowService } from "../../dashboard/service/show.service";
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';

@Component({
  selector: "mp-seatcount",
  templateUrl: "./seat-count.component.html",
  styleUrls: ["./seat-count.component.scss"],
})
export class SeatCountComponent implements OnInit {
  seatCount: number;
  showClass: any;
  booking: Booking;
  boxOfficeOnlyFlag:boolean;
  @Output() onSeatCountSelect = new EventEmitter<any>()
  // tslint:disable-next-line: max-line-length
  constructor(private modalservice: ModalService, 
    private router: Router, 
    public shows: ShowTimeService, 
    public showService: ShowService,
    private storeService: StoreService,
    private bookingService: BookingService) { 
      this.bookingService.get().subscribe(booking=> this.booking=booking)
    }

  ngOnInit(): void {
    this.showClass = this.booking.className;
    this.seatCount = this.booking.seatCount;
    this.boxOfficeOnlyFlag = this.booking.boxOfficeOnlyFlag;
    this.seatCount = this.storeService.get(
      'count',
      StoreType.LOCAL
    );
    if(this.boxOfficeOnlyFlag){
      this.boxOfficeOnlyFlag;
    }
    
    else if (this.seatCount == null) {
      this.setSeatCount(2);
    } 
    else {
      this.setSeatCount(this.seatCount);
     
    }

  }


  openLogin(template: TemplateRef<any>) {
    this.modalservice.show(template);
  }
  close() {
    this.modalservice.hide();
    // this.setSeatCount(2);
  }

  setSeatCount(count: number) {
    this.seatCount = count;
    this.booking={...this.booking, seatCount:count};
    this.bookingService.update(this.booking);

  }
  onSeatLayout(count: number) {
    console.log("onseat count");
    this.seatCount = count;
    this.onSeatCountSelect.emit(count);
    this.booking={...this.booking, seatCount:count};
    this.bookingService.update(this.booking);
    this.router.navigate(["/booking"]);
    this.modalservice.hide();
    this.storeService.put('count', count,
      StoreType.LOCAL);
  }
}
