import {
    Component,
    OnInit,
    TemplateRef,
    AfterViewInit,
    ViewChild,
} from '@angular/core';
import { ModalService } from 'src/app/_core/service/modal.service';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { StoreService } from 'src/app/_core/state/store.service';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { MessageService } from 'src/app/_shared/service/message.service';
import { TokenGuard } from 'src/app/_core/guard/token.guard';
import { VenueService } from '../shows/service/venue.service';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { Subject } from 'rxjs';
import { ShowService } from './service/show.service';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';

@Component({
    selector: 'mp-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
    activeElem = 'nowshowing';
    @ViewChild('locationTemplate', { static: false })
    locationTemplate: TemplateRef<any>;
    @ViewChild('venueTemplate', { static: false })
    venueTemplate: TemplateRef<any>;
    @ViewChild('filterTemplate', { static: false }) filterTemplate: TemplateRef<any>;
    city: string;
    booking: Booking;
    venueId: number;
    query: any;
    location: string;
    filterdGenre = [];
    filterdLang = []
    genreStoreArr = [];
    languageStoreArr = [];
    genreStoreArrTemp = [];
    languageStoreArrTemp = [];
    fetchPreference: any;
    fetchLanguage: any;
    nowShowingResponse: any;
    selected: boolean;
    cancadGenre = [];
    cancadLanguage = [];
    tempResponseLanguage: any;
    tempResponseGenre: any
    checkbox: boolean;
    filter: boolean = true;
    applyFilter: boolean = false;
    IsmodelShow: boolean;
    showVenue: boolean = false;



    public fromDashboard: Subject<any> = new Subject<any>();

    modalConfig = {
        animated: false,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-dialog-centered modal-custom',
    };


    public genreFilters: Subject<any> = new Subject<any>();
    check: boolean;
    checked: boolean;


    constructor(
        public userService: UserService,
        private modalService: ModalService,
        private storeService: StoreService,
        private messageService: MessageService,
        public venueService: VenueService,
        public showService: ShowService,
        private bookingService: BookingService,
        private tokenGuard: TokenGuard,
        private router: Router,
    ) { this.bookingService.get().subscribe(booking => this.booking = booking); }
    ngOnInit(): void {
        this.showVenue = environment.venue;
        this.tokenGuard.canActivate();
        this.location = this.storeService.get(
            'moviepanda.location', StoreType.LOCAL);
        if (this.booking.fromVenue == true) {
            this.activeElem = 'venues';
            this.filter = false;
        }
        this.getGenerandLanguage();
        this.filter = true;




    }


    clearText() {
        this.query = '';
    }

    ngAfterViewInit(): void {
        // if (!this.location) {
        //     this.openLocationModal();
        // }
    }
    openFilterModal() {
        this.modalService.show(this.filterTemplate, this.modalConfig);
    }
    openLocationModal() {
        this.modalService.show(this.locationTemplate, this.modalConfig);
    }

    locationChange(changedLocation: any) {
        this.messageService.updateMessage(changedLocation);
        this.location = changedLocation;
    }

    switchShow(viewname: any) {
        if (viewname === 'nowshowing') {
            this.activeElem = 'nowshowing';
            this.filter = true;
        } else if (viewname === 'upcoming') {
            this.activeElem = 'upcoming';
            this.filter = false;
        }
        else if (viewname === 'venues') {
            this.openVenueModal();
        }
    }

    openModal(template: TemplateRef<any>, componentName: String) {
        let config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: componentName == 'filterTemplate' ? 'modal-dialog-centered modal-custom' : 'modal-custom modal-dialog modal-lg',
        };

        if (componentName === 'filterTemplate') {
            config['backdropClass'] = 'custom-backdrop';
        }
        this.modalService.show(template, config);
    }

    closeModal() {
        this.modalService.hide();
        document.body.classList.remove('modal-open');
    }

    toMovieDetail() {
        this.closeModal();
        this.router.navigate(['/movie-detail']);
    }

    getGenerandLanguage() {
        this.showService.shows.subscribe((res: any) => {
            this.nowShowingResponse = res;
            res.forEach(genres => {
                for (let gener of genres.genres) {
                    let duplicate = gener.genreName;
                    this.filterdGenre.push({ genreName: duplicate, checked: false });
                    let item = new Set(this.filterdGenre);
                    this.filterdGenre = [...item];
                    this.filterdGenre = [...new Map(this.filterdGenre.map(item => [item["genreName"], item])).values()]
                }
            });
            res.forEach(language => {
                let duplicate = language.language;
                this.filterdLang.push({ languageName: duplicate, checked: false });
                let item = new Set(this.filterdLang);
                this.filterdLang = [...item];
                this.filterdLang = [...new Map(this.filterdLang.map(item => [item["languageName"], item])).values()]
            });
        })
    }


    addGenre() {
        this.genreStoreArr = [];
        this.genreStoreArrTemp.forEach(value => {
            this.genreStoreArr.push(value);
        });
    }


    addGenreName(genreName, e) {
        if (e.target.checked) {
            this.genreStoreArrTemp.push(genreName);
            this.applyFilter = true;
        }
        else {

            this.genreStoreArrTemp.splice(this.genreStoreArrTemp.indexOf(genreName), 1);
            if (this.genreStoreArrTemp.length === 0 && this.languageStoreArr.length === 0) {
                this.applyFilter = false;

            }
        }
    }


    filteredGenreApply() {

        let _fetchPreference = [];
        let _defaultGenre = [];
        this.fetchPreference = this.genreStoreArrTemp;
        if (this.cancadLanguage.length > 0) {
            this.tempResponseGenre = this.cancadLanguage
        } else {
            this.tempResponseGenre = this.nowShowingResponse;
        }
        this.tempResponseGenre.forEach((obj) => {
            for (let genre1 of obj.genres) {

                this.fetchPreference.indexOf(genre1.genreName) >= 0
                    ? _fetchPreference.push(obj)
                    : _defaultGenre.push(obj);

            }

            let _PreferredGenreMovies = Array.from(new Set(_fetchPreference));
            let _defaultGenreMovies = Array.from(new Set(_defaultGenre));
            _defaultGenreMovies = _defaultGenreMovies.filter(
                (val) => !_PreferredGenreMovies.includes(val)
            );
            this.cancadGenre = [..._PreferredGenreMovies, ..._defaultGenreMovies];
            this.genreFilters.next(this.cancadGenre)
        })



    }


    addLang() {
        this.languageStoreArr = [];
        this.languageStoreArrTemp.forEach(value => {
            this.languageStoreArr.push(value);
        });

    }

    addLanguage(langName, e) {
        if (e.target.checked) {
            this.languageStoreArrTemp.push(langName);
            this.applyFilter = true;
        } else {
            this.languageStoreArrTemp.splice(this.languageStoreArrTemp.indexOf(langName), 1)
            if (this.languageStoreArrTemp.length === 0 && this.genreStoreArrTemp.length === 0) {
                this.applyFilter = false;
            }
        }
    }

    filteredLanguageApply() {
        let _fetchLanguage = [];
        let _defaultLanguage = [];
        this.fetchLanguage = this.languageStoreArr;
        if (this.cancadGenre.length > 0) {
            this.tempResponseLanguage = this.cancadGenre
        } else {
            this.tempResponseLanguage = this.nowShowingResponse;
        }
        this.tempResponseLanguage.forEach((obj) => {
            this.fetchLanguage.indexOf(obj.language) >= 0
                ? _fetchLanguage.push(obj)
                : _defaultLanguage.push(obj);
            let _PreferredGenreMovies = Array.from(new Set(_fetchLanguage));
            let _defaultGenreMovies = Array.from(new Set(_defaultLanguage));
            _defaultGenreMovies = _defaultGenreMovies.filter(
                (val) => !_PreferredGenreMovies.includes(val)
            );
            this.cancadLanguage = [..._PreferredGenreMovies, ..._defaultGenreMovies];
            this.genreFilters.next(this.cancadLanguage)
        })
    }







    openVenueModal() {
        this.venueService.getVenuebyCity(this.location);
        this.modalService.show(this.venueTemplate, this.modalConfig);
    }

    onVenueSelect(venueId: number, venueName: string, addressLine1: string, addressLine2: string) {
        this.venueId = venueId;
        this.booking = { ...this.booking, venueName };
        this.booking = { ...this.booking, venueId };
        this.booking = { ...this.booking, addressLine1 };
        this.booking = { ...this.booking, addressLine2 };
        this.bookingService.update(this.booking);
        this.modalService.hide();
        this.fromDashboard.next(true);
        this.activeElem = 'venues';
        this.filter = false;
    }

    close() {
        if (undefined === this.booking.venueId) {
            this.activeElem = 'nowshowing';
        }

        this.modalService.hide();


    }



    closeLanguage(langName) {
        this.languageStoreArr.splice(this.languageStoreArr.indexOf(langName), 1);
        this.languageStoreArrTemp.splice(this.languageStoreArrTemp.indexOf(langName), 1);
        this.filterdLang.find(lang => lang.languageName == langName).checked = false;
        this.applyFilter = false;
        this.filteredLanguageApply();


    }

    closeGenre(genreName) {
        this.genreStoreArr.splice(this.genreStoreArr.indexOf(genreName), 1);
        this.genreStoreArrTemp.splice(this.genreStoreArrTemp.indexOf(genreName), 1);
        this.filterdGenre.find(genre => genre.genreName == genreName).checked = false;
        this.applyFilter = false;
        this.filteredGenreApply();
    }
    apply() {
        this.filteredLanguageApply();
        this.filteredGenreApply();
        this.close();
        this.addGenre();
        this.addLang()
    }
}







