import { Component, OnInit } from "@angular/core";
import { ShowService } from "../../dashboard/service/show.service";
import { ModalService } from "src/app/_core/service/modal.service";
import { UserReviewService } from "../../profile/service/user-review.service";
import { DatePipe } from "@angular/common";
import { Review } from "../../profile/model/review";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';

@Component({
  selector: "mp-userreview",
  templateUrl: "./userreview.component.html",
  styleUrls: ["./userreview.component.scss"]
})
export class UserreviewComponent implements OnInit {
  rating: number;
  description: string;
  titleComment: string;
  userId: string;
  login_form: FormGroup;
  booking: Booking
  constructor(public showService: ShowService, private modalservice: ModalService, public userService: UserService,
    // tslint:disable-next-line: align
    public userReview: UserReviewService, private datePipe: DatePipe, fb: FormBuilder, private bookingService: BookingService) {
    this.login_form = fb.group({
      title: [
        null,
        Validators.compose([
          Validators.required,

        ])
      ],
      description: [
        null,
        Validators.compose([
          Validators.required,

        ])
      ]
    });
    this.bookingService.get().subscribe(booking => this.booking = booking)
  }

  ngOnInit(): void {


  }

  userReviewComments(movieId: number) {
    this.userService.getUser().subscribe((users) => {
      let user = users[0];
      this.userId = user.userId;
    });
    if (this.login_form.valid) {
      const review = new Review();
      review.movieId = movieId;
      review.title = this.titleComment;
      review.comments = this.description;
      review.userId = this.userId;
      const todaysDate = new Date();
      const currentDate = this.datePipe.transform(todaysDate, "dd-MMM-yyyy");
      review.reviewDate = currentDate;
      review.rating = this.rating;
      this.userReview.addUserReview(review);
      this.modalservice.hide();
    }

  }

  closeUserReviewModal() {
    this.modalservice.hide();
  }
  onClick(rating: number): void {
    this.rating = rating;
  }
}
