import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReservationService } from '../service/reservation.service';
import {
    Seat,
    Class,
    SeatLayout,
    SelectedSeatLayout,
    SelectedClass,
} from '../model/seat-layout';
import {
    DomSanitizer,
    SafeResourceUrl,
} from '@angular/platform-browser';
import { ModalService } from 'src/app/_core/service/modal.service';
import { Router } from '@angular/router';
import { ShowTimeService } from '../../shows/service/show-time.service';
import { filter } from 'rxjs/operators';
import { Show } from '../../shows/model/show';
import { PaymentService } from '../service/payment.service';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from '../../../_core/constants/store-type.enum';
import { ShowDate } from '../../shows/model/show-date';

import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { UnBlockSelectedClass, UnBlockSelectedSeatLayout } from 'src/app/_shared/booking/ model/seat-layout';
export enum Status {
    BOOKED = "BOOKED",
    SOLDOUT = "SOLDOUT",
    SOCIAL_DISTANCE = "SOCIAL DISTANCE",
    LOCKED = "LOCKED",
    BLOCKED = "BLOCKED",
    DEFAULT_BLOCKED = "DEFAULT_BLOCKED",
    BOXOFFICE = "BOXOFFICE",
    BOXOFFICE_HIDDEN = "BOXOFFICE_HIDDEN"
}
@Component({
    selector: 'mp-seat-layout',
    templateUrl: './seat-layout.component.html',
    styleUrls: ['./seat-layout.component.scss'],
})
export class SeatLayoutComponent implements OnInit {
    movieTrailerUrl: SafeResourceUrl;
    city: string;
    showPublishedId: number;
    movieId: number;
    showTime: string;
    screenId: number;
    posterUrl: string;
    SeatStatus = Status;
    selectedDate: string;
    seatLayout: SeatLayout;
    venueShows: Show[];
    selectedSeats = new Array<Seat>();
    selectedSeatCount: number;
    originalSeatCount: number;
    showProceed = false;
    hideFooter: boolean = true;
    classPublishedId: number;
    classId: number;
    seatselect = false;
    venueName: string;
    venueId: number;
    movieName: string;
    seatCount: number;
    className: string;
    formattedDate: string;
    language: string;
    showClass: any;
    uniqueSeats: any;
    movieLanguage: any;
    public activeElement: string = 'nodate';
    booking: Booking;
    showDates: any;
    isLoading = false;
    seatStatus: any;
    classClearSeat: any;

    constructor(
        public reservationService: ReservationService,
        private storeService: StoreService,
        public sanitizer: DomSanitizer,
        private modalservice: ModalService,
        private router: Router,
        public showTimeService: ShowTimeService,
        public paymentService: PaymentService,
        private translate: TranslateService,
        private bookingService: BookingService,

    ) {
        this.bookingService.get().subscribe(booking =>
            this.booking = booking);

    }

    ngOnInit(): void {
        this.language = this.storeService.get(
            'moviepanda.language',
            StoreType.LOCAL
        );
        this.classClearSeat = null;
        if (!this.language) {
            this.translate.setDefaultLang('English');
        } else {
            this.translate.setDefaultLang(this.language);
        }
        this.movieLanguage = this.booking.language;
        this.movieName = this.booking.movieName;
        this.movieId = this.booking.movieId;
        this.venueName = this.booking.venueName;
        this.posterUrl = this.booking.posterUrl;
        this.city = this.booking.city;
        this.showPublishedId = this.booking.showPublishedId;
        this.seatCount = Number(this.booking.seatCount);
        this.originalSeatCount = this.seatCount;
        this.selectedSeatCount = this.seatCount;

        this.showTime = this.booking.showTime;
        this.selectedDate = this.booking.showDate;
        this.venueId = this.booking.venueId;
        this.showClass = this.booking.className;
        this.getShowDates(this.movieId, this.city);
        this.getMovieShowTimes(this.selectedDate);
        this.getSeatLayout();
        this.reservationService.seatlayout.subscribe((layout) => {
            this.seatLayout = layout;
        });
        this.movieTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.booking.trailerUrl
        );
    }

    async getSeatLayout() {
        await this.reservationService.seatingRepresentation(
            this.showPublishedId,
            this.city
        );
    }
    async getShowDates(movieId: number, city: string) {
        await this.showTimeService.getMovieShowDates(movieId, city);
        this.showTimeService.movieShowDates.subscribe((dates) => {
            this.showDates = dates;
        })
        this.formattedDate = this.selectedDate;
        this.seatselect = false;


    }

    async getMovieShowTimes(showDate: string) {
        if (this.selectedDate != showDate) {
            this.showTime = "";
        }
        this.selectedDate = showDate;
        this.booking = { ...this.booking, showDate: this.selectedDate };
        await this.showTimeService.getMovieShowTime(
            this.movieId,
            this.city,
            showDate
        );
        this.showTimeService.venues
            .pipe(
                filter((venues) =>
                    venues.some(
                        (venue) => venue.venueId === this.venueId
                    )
                )
            )
            .subscribe((venues) => {
                this.venueShows = venues[0].shows;
                this.selectedSeatCount = 0;
            });
        this.seatselect = false;

        if (ShowDate !== undefined) {
            this.activeElement = showDate;

        }

        this.clearSelectedSeats();
    }

    onShowTimeSelection(show: any) {
        this.booking = { ...this.booking, showPublishedId: show.showPublishedId };
        this.showTime = show.showTime;
        this.booking.showTime = show.showTime;
        this.reservationService.seatingRepresentation(
            show.showPublishedId,
            this.city
        );
        this.seatselect = false;
        this.isLoading = true;
        setTimeout(() => (this.isLoading = false), 1000);
        this.clearSelectedSeats();
    }

    selectSeat(
        seats: Array<Seat>,
        cls: Class,
        selectedSeatindex: number
    ) {
        this.classPublishedId = cls.classPublishedId;
        this.classId = cls.classId;
        this.className = cls.className;
        //Different class seat selection cleared 
        //same class seat selection
        if (this.classClearSeat === null) {
            this.classClearSeat = this.className;
        }

        if (this.classClearSeat != this.className) {
            this.clearSelectedSeats();
            this.classClearSeat = this.className;
        }
        this.selectedSeatCount = this.selectedSeats.length;
        this.originalSeatCount = Number(this.originalSeatCount);
        const numberOfSeatsToBook =
            // tslint:disable-next-line: triple-equals
            this.originalSeatCount - this.selectedSeatCount == 0
                ? this.originalSeatCount
                : this.originalSeatCount - this.selectedSeatCount;
        //find the duplicate id select and deselect the seats
        this.uniqueSeats = this.selectedSeats.find(
            (x) => x.seatId === seats[selectedSeatindex].seatId
        );
        //to clear original selected seat count
        if (this.originalSeatCount === this.selectedSeats.length) {
            this.clearSelectedSeats();
            if (this.uniqueSeats) {
                //to clear original selected seat count
                this.seatselect = false;
                this.clearSelectedSeats();
            } else {
                this.clearSelectedSeats();
                for (
                    let i = selectedSeatindex;
                    i < selectedSeatindex + numberOfSeatsToBook;
                    i++
                ) {
                    const status = seats[i].bookingStatus;
                    // tslint:disable-next-line: curly
                    if (
                        !seats[i].seat ||
                        status === Status.BOOKED || status === Status.BLOCKED ||
                        status === Status.LOCKED || status === Status.SOLDOUT || status === Status.SOCIAL_DISTANCE || status === Status.DEFAULT_BLOCKED || status === Status.BOXOFFICE || status === Status.BOXOFFICE_HIDDEN
                    )
                        return;
                    this.selectSeatInSequance(seats[i]);
                }
            }
        } else {
            if (this.uniqueSeats) {
                this.seatselect = false;
                this.clearSelectedSeats();
            }
            else {
                for (
                    let i = selectedSeatindex;
                    i < selectedSeatindex + numberOfSeatsToBook;
                    i++
                ) {
                    const status = seats[i].bookingStatus;
                    // tslint:disable-next-line: curly
                    if (
                        !seats[i].seat ||
                        status === Status.BOOKED || status === Status.BLOCKED ||
                        status === Status.LOCKED || status === Status.SOLDOUT || status === Status.SOCIAL_DISTANCE || status === Status.DEFAULT_BLOCKED || status === Status.BOXOFFICE || status === Status.BOXOFFICE_HIDDEN
                    )
                        return;
                    this.selectSeatInSequance(seats[i]);
                }
            }
        }
    }

    selectSeatInSequance(seat: Seat) {
        this.hideFooter = true;
        if (!seat.seat) {
            return;
        }
        //find the duplicate id select and deselect the seats
        // this.uniqueSeats = this.selectedSeats.find(
        //     (x) => x.seatId === seat.seatId
        // );
        //Different class seat selection cleared 
        //same class seat selection
        if (this.classClearSeat === null) {
            this.classClearSeat = this.className;
        }

        if (this.classClearSeat != this.className) {
            this.clearSelectedSeats();
            this.classClearSeat = this.className;
        }
        if (this.uniqueSeats) {
            this.seatselect = false;
            this.clearSelectedSeats();
        } else {
            seat.selectedstatus_ui = 1;
            //right to left seat selection duplicate entry
            let duplicateSeat = false;
            if (this.selectedSeats.length > 0) {
                duplicateSeat = this.selectedSeats.find((x) => x.seatId === seat.seatId) ? true : false;
            }
            if (duplicateSeat === false) {
                this.selectedSeats.push(seat);
            }
            // this.selectedSeats.push(seat);
            this.showProceed =
                this.selectedSeats.length === this.originalSeatCount;
            this.seatselect = true;
        }
    }
    hideShow() {
        if (this.selectedSeats.length === this.originalSeatCount) {
            this.hideFooter = false;
        } else {
            this.hideFooter = true;
        }
    }



    clearSelectedSeats() {
        this.classClearSeat = null;
        // this.storeService.delete('className', StoreType.LOCAL);
        this.selectedSeats = new Array<Seat>();
        this.seatLayout.classes.forEach((cls) => {
            cls.labels.forEach((row) => {
                row.seats.forEach((seat) => {
                    seat.selectedstatus_ui = 0;
                });
            });
        });
    }

    proceed() {
        const seclectedSeats = new SelectedClass(
            this.classPublishedId,
            this.selectedSeats
        );
        // this.booking.classPublishedId = this.classPublishedId;
        // this.booking.classId = this.classId;
        // this.booking.className = this.className;

        this.booking = { ...this.booking, classPublishedId: this.classPublishedId };
        this.booking = { ...this.booking, classId: this.classId };
        this.booking = { ...this.booking, className: this.className };
        let selectedSeatLayout = new SelectedSeatLayout(
            seclectedSeats
        );
        const unseclectedSeats = new UnBlockSelectedClass(
            this.classPublishedId,
            this.selectedSeats
        );
        let seatlayout = [unseclectedSeats];
        let unblockseats = new UnBlockSelectedSeatLayout(
            seatlayout
        );
        // this.booking.seat_layout = selectedSeatLayout;
        this.booking = { ...this.booking, seat_layout: selectedSeatLayout };
        this.booking = { ...this.booking, onSummary: true };
        this.booking = { ...this.booking, seatLayout: unblockseats };

        this.bookingService.update(this.booking);
        this.paymentService.getFareDetail();
        this.router.navigate(['/summary']);
    }

    proceedSeatSelection(seatselection: TemplateRef<any>) {
        let config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            class: 'my-modal modal-dialog-centered width-big',
        };
        this.modalservice.show(seatselection, config);
    }


    setSeatCount(count: number) {
        this.clearSelectedSeats();
        this.seatCount = Number(count);
        this.originalSeatCount = Number(count);
        this.selectedSeatCount = Number(count);
        this.booking = { ...this.booking, seatCount: count };
        this.seatselect = false;
    }
    close() {
        this.modalservice.hide();
        this.setSeatCount(2);
    }

    onSeatLayout(count: number) {
        this.clearSelectedSeats();
        this.seatCount = Number(count);
        this.originalSeatCount = Number(count);
        this.selectedSeatCount = Number(count);
        this.seatselect = false;
        this.modalservice.hide();
        this.router.navigate(["/booking"]);
    }
}
