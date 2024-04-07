import {
    Component,
    OnInit,
    TemplateRef,
    Output
} from '@angular/core';
import { StyleChangeService } from '../service/style-change.service';
import { StoreService } from '../../_core/state/store.service';
import { StoreType } from '../../_core/constants/store-type.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LogService } from 'src/app/_core/log/log.service';
import { UserService } from '../user/service/user.service';
import { User } from '../user/model/user';
import { Router, NavigationEnd } from '@angular/router';
import { CommonConstants } from '../../_core/constants/common-constants.enum';
import { ModalService } from 'src/app/_core/service/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/_features/profile/service/profile.service';
import { MessageService } from '../service/message.service';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { ShowService } from 'src/app/_features/dashboard/service/show.service';
import { Booking } from '../booking/ model/booking';
import { BookingService } from '../booking/service/booking.service';
import { VenueService } from 'src/app/_features/shows/service/venue.service';
import { environment } from "src/environments/environment";

@Component({
    selector: 'mp-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    language: string;
    isLoggedIn: boolean;
    defaultLanguages = ['English', 'தமிழ்'];
    subscription: Subscription;
    modalRef: BsModalRef;
    user: User;
    ClickCounter: any;
    profilename: string;
    locationText: any;
    hidecancel: boolean = false;
    nullTicket: any;
    query: any;
    nowShowingMovies: any;
    venueId: number;
    booking: Booking;
    showLogo: boolean = false;
    HideLogo: boolean = false;
    showSearch: boolean = true;
    hideLogin: boolean = true;
    searchdropdown: boolean = false;
    bookingHistoryModels: Array<any>;
    hideLocation:boolean= false;
    widthCondition: boolean = false;
    @Output() outputSelectTab = new EventEmitter<string>();
    companyId
    

    config = {
        animated: false,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'my-modal modal-dialog-centered width-big',
    };
    emailRegex = new RegExp(
        '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/'
    );
    phoneRegex = new RegExp(
        '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'
    );
    activeElem = 'Movies';
    searchTerm: string;
    constructor(
        private stylechanges: StyleChangeService,
        private translate: TranslateService,
        private storeService: StoreService,
        private modalService: ModalService,
        private logService: LogService,
        public userService: UserService,
        private router: Router,
        public profileService: ProfileService,
        private messageService: MessageService,
        public showService: ShowService,
        public venueService: VenueService,
        private bookingService: BookingService
    ) {
        translate.setDefaultLang('English');

        var compId=`${environment.companyId}`;
        if(compId){
            this.companyId = `${environment.companyId}`;
        }else{
            this.companyId="-999"
        }
        
        this.subscription = this.messageService
            .getMessage()
            .subscribe(
                (mymessage) => (this.locationText = mymessage)
            );
        this.bookingService.get().subscribe(booking => this.booking = booking);

         if(this.companyId != "-999"){
            this.hideLocation = false;
        }else {
            this.hideLocation = true;
        }
        
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/shows') {
                    this.showLogo = false;
                } else if (event.url === '/movie') {
                    this.showLogo = false;
                }
                else if (event.url === '/summary') {
                    this.showLogo = false;
                    this.showSearch = false;
                    this.hideLogin = false;
                }
                else {
                    this.showLogo = true;
                    this.showSearch = true;
                    this.hideLogin = true;
                }
            }
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/shows') {
                    this.HideLogo = true;
                } else if (event.url === '/movie') {
                    this.HideLogo = true;
                } else if (event.url === '/summary') {
                    this.HideLogo = true;
                }
                else {
                    this.HideLogo = false;
                }
            }
        });

    }

    ngOnInit(): void {
       
        // Language setup
        this.locationText = this.storeService.get(
            'moviepanda.location',
            StoreType.LOCAL
        );
        this.language = this.storeService.get(
            'moviepanda.language',
            StoreType.LOCAL
        );
        // for Search Functionality
        this.showService.getNowShowingMovies(this.locationText);
        this.venueService.getVenuebyCity(this.locationText);
        if (!this.language) {
            this.language = this.defaultLanguages[0];
        }
        this.user = new User();
        this.isLoggedIn = this.storeService.get(
            CommonConstants.LOGGED_IN,
            StoreType.LOCAL
        );
        if (this.isLoggedIn == null) {
            this.isLoggedIn = false;
        }
        this.getUserDetails();
        // this getMovies function is for Search functionality 
        this.getMovies();
    }

    openNav() {
        this.widthCondition = true;
      }
      closeNav() {
        this.widthCondition = false;
      }

    route() {
        this.router.navigate(['/']);
    }

    getUserDetails() {
        this.userService.getUser().subscribe((users) => {
            if (users[0]) {
                this.user = users[0];
                this.storeService.put(
                    'primaryEmail',
                    this.user.primaryEmail,
                    StoreType.LOCAL
                );
                this.storeService.put(
                    'primaryPhoneNumber',
                    this.user.primaryPhoneNumber,
                    StoreType.LOCAL
                );
                this.storeService.put(
                    'userId',
                    this.user.userId,
                    StoreType.LOCAL
                );
                if (
                    null != this.user.userId &&
                    this.user.userId != '_ANONYMOUS_USER'
                ) {
                    this.profilename = this.user.firstName;
                    this.isLoggedIn = true;
                    if (this.user.lastName) {
                        this.profilename += ' ' + this.user.lastName;
                    }
                } else {
                    this.profilename = 'Guest';
                }
            }
        });
    }

    changeStyle() {
        this.stylechanges.changeHomeStyle();
    }

    setLanguage(language: string) {
        this.translate.use(language);
        this.language = language;
        this.storeService.put(
            'moviepanda.language',
            this.language,
            StoreType.LOCAL
        );
    }

  openModal(template: TemplateRef<any>, componentName: String) {
    let config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: componentName == 'location' ? 'modal-dialog-centered modal-custom' : 'modal-xl modal-cus',
    };
    this.modalService.show(template, config);
}

    navigateToProfile(name: string) {
        this.logService.info(
            'Navigating to desired page' +
            name +
            '&&' +
            (this.user.isLoggedIn === true)
        );
        this.storeService.put('tabName', name, StoreType.LOCAL);
        this.outputSelectTab.emit(name);

        if (this.user.isLoggedIn === true && name === 'profile') {
            this.router.navigate(['/profile']);
        } else if (
            this.user.isLoggedIn === true &&
            name === 'bookingHistory'
        ) {
            this.router.navigate(['/booking-history']).then(() => {
                window.location.reload();
            });
        } else {
            this.router.navigate(['/profile']);
            this.isLoggedIn = false;
        }
    }

    logoutUser() {
        this.isLoggedIn = false;
        this.storeService.delete('currentUser', StoreType.LOCAL);
        this.storeService.delete('loggedin', StoreType.LOCAL);
        this.storeService.delete(
            'moviepanda.fetchPreferenceVenue',
            StoreType.LOCAL
        );
        this.storeService.delete(
            ' moviepanda.fetchPreferenceGenre',
            StoreType.LOCAL
        );
        this.storeService.delete(
            CommonConstants.TOKEN_KEY,
            StoreType.LOCAL
        );
        if (this.router.url === '/') {
            window.location.reload();
        } else {
            this.router.navigate(['/']);
        }
    }
    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/']);
    }
    locationChange(changedLocation: any) {
        this.locationText = changedLocation;
    }
    getMovies() {
        this.showService.getNowShowingMovies(this.locationText);
        this.showService.shows.subscribe((res) => {
            this.nowShowingMovies = res;
        });
    }

    searchMovie(movie: any) {
        console.log("search com movie")
        const booking = {} as Booking;
        booking.city = this.locationText;
        Object.assign(booking, movie);
        this.showService.setBooking(booking);
        if (this.router.url === '/shows') {
            window.location.reload();
        } else {
            this.router.navigate(["/shows"]);
        }
    }

    searchVenue(venueId: number, venueName: string, addressLine1: string, addressLine2: string) {
        this.venueId = venueId;
        this.booking = { ...this.booking, venueName };
        this.booking = { ...this.booking, venueId };
        this.booking = { ...this.booking, addressLine1 };
        this.booking = { ...this.booking, addressLine2 };
        this.booking = { ...this.booking, fromVenue: true };
        this.bookingService.update(this.booking);
        if (this.router.url === '/') {
            window.location.reload();
        } else {
            this.reloadComponent();
        }
    }

    SearchBar() {
        if (this.query === "") {
            this.searchdropdown = false;
        } else {
            this.searchdropdown = true;

        }
    }
    updateSearch(e) {
        this.searchTerm = e.target.value;

    }
    mouseLeave() {
        this.query === "";
    }

    switchShow(viewname: any) {
        if (viewname === 'Movies') {
            this.activeElem = 'Movies';
        } else if (viewname === 'Venue') {
            this.activeElem = 'Venue';
        }

    }

}
