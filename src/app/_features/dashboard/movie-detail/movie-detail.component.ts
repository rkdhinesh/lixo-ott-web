import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { MovieService } from '../../shows/service/movie.service';
import { ShowService } from '../service/show.service';
import { ModalService } from 'src/app/_core/service/modal.service';
import { RecommendedMoviesService } from '../../profile/service/recommended-movies.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MovieStateService } from 'src/app/_shared/movie/service/movie-state.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { StoreService } from 'src/app/_core/state/store.service';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { UserReviewService } from '../../profile/service/user-review.service';
import { DatePipe } from '@angular/common';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { Review } from '../../profile/model/review';

@Component({
  selector: 'mp-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {

  movieId: number;
    largePoster: string = "";
    movieTrailerUrl: any;
    recommendedMovie: any;
    movie: any;
    movies: any;
    booking: Booking
    navTab = "summary";
    subscription: Subscription = new Subscription();
    @ViewChild('trailerPlayer') trailerPlayer: TemplateRef<any>;
    @ViewChild("adduserreview") adduserreview: TemplateRef<any>;
    addReview: boolean;
    rating: number;
    description: string;
    titleComment: string;
    userId: string;
    login_form: FormGroup;
    userReviewForm:boolean=false; 
    slideConfig = {
        slidesToShow: 6,
        slidesToScroll: 1,
        prevArrow:
            '<span class="slick-prev  position-absolute"><img class="mw-100" src="./assets/images/img/slider-left.svg"></span>',
        nextArrow:
            '<span class="slick-next  position-absolute"><img class="mw-100" src="./assets/images/img/slider-right.svg"></span>',
        autoplay: false,
    };
    slides = [342, 453, 846, 855, 234, 564, 744, 243];
    checkbookbutton: boolean;
    homebutton: boolean;
    showmore: boolean;
    showless = true;
    selectedIndex = 1;
    movieDetails: any;
    purchaseStatus: boolean = false;
    displayIframe: boolean =false;
    showDetail: boolean = false;
    constructor(
        public movieService: MovieService,
        public showService: ShowService,
        private modelService: ModalService,
        public recommendedMoviesService: RecommendedMoviesService,
        public domSanitizer: DomSanitizer,
        public movieStateService: MovieStateService,
        private route: Router,
        public userService: UserService,
        private storeService: StoreService,
        private bookingService: BookingService,
        private datePipe: DatePipe, fb: FormBuilder,
        public userReview: UserReviewService,
        private modalService: ModalService
    ) {
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
        this.bookingService.get().subscribe(booking => this.booking = booking);
    }
    ngOnInit(): void {
        this.userService.getUser().subscribe((users) => {
            let user = users[0];
            this.userId = user.userId;
        });
        if(this.userId != null && this.userId != "_ANONYMOUS_USER")
        {
            this.userReviewForm=true;
        }
        this.addReview = false;
        this.movieId = this.booking.movieId;
        this.checkbookbutton = JSON.parse(this.storeService.get(
            'btnflag',
            StoreType.LOCAL
        ));
        this.movieService.getMovieDetails(this.movieId);
        this.getRecommendedMovie();
        this.alterDescriptionText();
        let movieStateSub = this.movieStateService.getMovie(this.movieId).subscribe((movie) => {
            if (null != movie[0] && undefined != movie[0]) {
                this.movie = movie[0];
                if (this.movie.posterUrl.indexOf('~') != -1) {
                    this.largePoster = this.movie.posterUrl.slice(this.movie.posterUrl.indexOf('~') + 1, this.movie.posterUrl.length);
                    this.storeService.put("posters", this.largePoster, StoreType.LOCAL);
                }
            } else {
                this.largePoster = this.storeService.get("posters", StoreType.LOCAL);
            }
        });
        this.movieTrailerUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
            this.booking.trailerUrl);
        this.subscription.add(movieStateSub)

        this.showService.isPurchased.subscribe(
            (status) => {
                this.purchaseStatus = status;
            }
        )
    }

    showDetailed() {
        this.showDetail = !this.showDetail;
    }

    openModal(template: TemplateRef<any>, componentName: String) {
        let config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: componentName == 'rentTemplate' || componentName == 'termsTemplate' || componentName == 'paymentTemplate' ? 'modal-dialog-centered' : 'modal-custom modal-dialog modal-lg'
        };

        if (componentName === 'filterTemplate') {
            config['backdropClass'] = 'custom-backdrop';
        }
        this.modalService.show(template, config);
    }

    closeModal() {
        this.modalService.hide();
        // document.body.classList.remove('modal-open');
    }

    termsModal(template: TemplateRef<any>, componentName: String) {
        this.closeModal();
        this.openModal(template, componentName);
    }

    hoverRentClick(template: TemplateRef<any>, componentName: String) {
        this.closeModal();
        this.openModal(template, componentName);
    }

    alterDescriptionText() {
        this.movieService.getMovieDetails(this.movieId);
        this.movieService.movie.subscribe((movie) => {
            this.movie = movie;
            console.log("total reviews" + this.movie.criticReviews.length)
            if (this.movie.criticReviews.length == 0 || this.movie.criticReviews.length == 1 || this.movie.criticReviews == null) {
                this.showless = false;
                this.showmore = false;
            } else if (this.movie.criticReviews.length > this.selectedIndex) {
                this.showmore = true;
                this.showless = false;
            } else {
                this.showmore = false;
                this.showless = true
            }
            this.movieDetails = this.movie.criticReviews;
        });

    }
    showMoreDetails() {
        this.selectedIndex = this.movieDetails.length;
        this.showmore = false;
        this.showless = true;
    }
    showLessDetails() {
        this.selectedIndex = 1;
        this.showmore = true;
        this.showless = false;
    }
    navigatehomes() {
        this.checkbookbutton = JSON.parse(this.storeService.get(
            'btnflag',
            StoreType.LOCAL
        ));
        if (!this.checkbookbutton) {
            this.route.navigate(['/']);
        } else {
            this.route.navigate(['/shows']);
        }

    }
    async getRecommendedMovie() {
        let city = this.storeService.get(
            'moviepanda.location',
            StoreType.LOCAL
        );
        this.recommendedMoviesService.getRecommendedMovies(
            this.movieId,
            city
        );
        this.recommendedMoviesService.recommandedMovie.subscribe(
            (response) => {
                this.recommendedMovie = response;
            }
        );
    }
    onMovieSelect() { }

    navigateRecommendedMovie(recomanded: any, movieId: number) {
        this.booking.recommanded = recomanded;
        this.booking.movieId = movieId;
        this.bookingService.update(this.booking);
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate(['/shows']);
        this.modelService.hide();
    }
    movieModalClose() {
        this.modelService.hide();
    }


    showMovieShowDetails() {
        this.route.navigate(['/shows']);
    }
    switchTab(viewname: any) {
        if (viewname === 'summary') {
            this.addReview = false;
            console.log("summary");
            this.navTab = "summary";
        } if (viewname === 'criticReview') {
            this.addReview = false;
            console.log("criticReview");
            this.navTab = "criticReview";
        } if (viewname === 'userReview') {
            this.storeService.put('userReview', viewname, StoreType.LOCAL);
            console.log("userReview");
            this.navTab = "userReview";
        }
    }

    onClickPlay(templateName: TemplateRef<any>) {
        let config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'my-modal modal-dialog-centered modal-lg',
        };
        this.modelService.show(templateName, config);
    }

    review() {
        this.addReview = true;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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
        review.companyId=this.storeService.get('companyId', StoreType.LOCAL);
        review.systemId="moviepanda";
        const todaysDate = new Date();
        const currentDate = this.datePipe.transform(todaysDate, "dd-MMM-yyyy");
        review.reviewDate = currentDate;
        review.rating = this.rating;
        this.userReview.addUserReview(review);
        this.movieService.getMovieDetails(this.movieId);
        this.userReview.userreview.subscribe(() => {
            if (this.userReview.isErrorFetchingUserReview === false) {
                var viewname = this.storeService.get('userReview', StoreType.LOCAL);
                if (viewname) {
                    this.navTab = 'userReview';
                    this.ngOnInit();
                }
            }
        })
    }
    }

    onClick(rating: number): void {
        this.rating = rating;
    }
}
