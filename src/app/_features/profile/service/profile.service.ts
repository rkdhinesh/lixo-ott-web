import { Injectable } from '@angular/core';
import { RestApiService } from 'src/app/_core/service/rest-api.service';
import { LogService } from 'src/app/_core/log/log.service';
import { EndpointsConfig } from 'src/app/_config/endpoints.config';
import { User } from 'src/app/_shared/user/model/user';
import { RequestHeader } from 'src/app/_core/model/request-header';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { updateProfileRequest } from '../../booking/model/update-profile-request';
import { formatDate } from '@angular/common';
import { StoreType } from 'src/app/_core/constants/store-type.enum';
import { StoreService } from 'src/app/_core/state/store.service';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    bookingHistory = new Subject();
    bookingHistoryDetail = new Subject();
    termsandcondition = new Subject();
    cancellationAmount = new Subject();
    updatedPrimaryNumber = new Subject();
    fileId: number;
    venueId: number;
    taxvalues = new Subject();
    handlingCharges = new Array<any>();
    taxCharges = new Array<any>();
    user = new Subject<User>();
    updateUserProfile = new Subject();
    users: User;
    // profiles: boolean;
    isErrorFetchingprofile = false;
    isErrorUpdateProfile = false;
    isErrorBooking = false;
    isErrorCancelHistory = false;
    cancellationRefundAmount = false;
    isErrorCancelRules = false;
    isErrorRefundAmount = false;
    isErrorHistoryNotAvailable=false;
    bookingHistoryModels: Array<any>;
    hidecancel: boolean;
    nullTicket: any;
    totalSeats: number;
    updatephonenumber: string;
    constructor(
        private restService: RestApiService,
        private logService: LogService,
        private userService: UserService,
        private storeService: StoreService,
    ) { }

    getProfile(user: User): any {
        this.restService
            .post(EndpointsConfig.profile.retrieve, {
                header: new RequestHeader(),
            })
            .subscribe({
                next: (response) => {
                    if (response.status.statusCode === '2001') {
                        user = response;
                        this.storeService.put(
                            'companyId',
                            user.companyId,
                            StoreType.LOCAL
                        );
                        user.isLoggedIn = true;
                        this.userService.update(user);
                        this.user.next(user);
                        this.updatephonenumber =
                            user.primaryPhoneNumber;
                    } else {
                        this.isErrorFetchingprofile = true;
                        this.logService.error(
                            '~EditProfileComponent~getProfile~Profile retrival failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.isErrorFetchingprofile = true;
                    this.logService.error(
                        '~EditProfileComponent~getProfile~profile fetech error' +
                        err
                    );
                },
            });
    }


    updateProfile(user): any {
        const updateprofile = new updateProfileRequest();
        updateprofile.firstName = user.firstName;
        updateprofile.lastName = user.lastName;
        updateprofile.primaryEmail = user.primaryEmail;
        updateprofile.primaryPhoneNumber = user.primaryPhoneNumber;
        updateprofile.gender = user.gender;
        updateprofile.dateOfBirth = formatDate(
            user.dateOfBirth,
            'dd-MMM-yyyy',
            'en-US'
        );
        updateprofile.header = new RequestHeader();
        this.restService
            .post(EndpointsConfig.profile.update, updateprofile)
            .subscribe({
                next: (response) => {
                    if (response.status.statusCode === '2001') {
                        this.userService.update(user);
                        this.user.next(user);

                        this.logService.info(
                            '~ProfileComponent~~ updateprofile~~updateprofile successfully'
                        );
                    } else if (response.status.statusCode === '3002') {
                        this.isErrorUpdateProfile = true;
                        this.logService.error(
                            '~ProfileComponent~updateprofile~updateprofile failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.isErrorUpdateProfile = true;
                    this.logService.error(
                        '~EditProfileComponent~updateProfile~updateProfile fetech error' +
                        err
                    );
                },
            });
    }

    // history
    getBookingHistory(){
        const header = {
            header: new RequestHeader, 
        };
        this.isErrorHistoryNotAvailable=false;
        this.isErrorBooking = false;
        this.restService
            .post(EndpointsConfig.profile.bookinghistoryInfo,header)
            .subscribe({
                next: (response) => {
                    this.totalSeats = 0;
                    if (response.status.statusCode === '1001') {
                        if(undefined !=response){
                        this.bookingHistory.next(response);
                        this.bookingHistoryModels =
                            response.history_details.content;
                        this.nullTicket = this.bookingHistoryModels.length;
                        for (const historyModel of this
                            .bookingHistoryModels) {
                            this.venueId = historyModel.venue_id;
                            if (
                                historyModel.booking_status ===
                                'BOOKED'
                            ) {
                                this.totalSeats +=
                                    historyModel.seat_count;
                            }
                        }
                        this.logService.info(
                            '~HistoryComponent~getBookingHistory~getBookingHistory successfully'
                        );
                        }else{
                            this.isErrorBooking = true;
                            this.bookingHistory.error("error");
                        }
                    } else if(response.status.statusCode === '1006')
                    {
                        this.isErrorBooking = true;
                        this.isErrorHistoryNotAvailable=true;
                        
                    } else {
                        this.isErrorBooking = true;
                        this.logService.error(
                            '~HistoryComponent~getBookingHistory~bookinghistory failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.isErrorBooking = true;
                    this.logService.error(
                        '~HistoryComponent~getBookingHistory~bookinghistory fetech error' +
                        err
                    );
                },

            });
    }
    retrievingTerms(venueId: number) {
        const cancel = {
            venueId: venueId,
            header: new RequestHeader(),
        };
        this.restService
            .post(
                EndpointsConfig.cancelation.cancelationrules,
                cancel
            )
            .subscribe({
                next: (response) => {
                    if (response.status.statusCode === '1001') {
                        this.termsandcondition.next(response.cancelMasterEntity);
                        this.fileId = response.cancelMasterEntity.fileId;
                        this.storeService.put(
                            'fileId',
                            this.fileId,
                            StoreType.LOCAL
                        );
                        this.logService.info(
                            '~HistoryComponent~cancelBooking~cancelbooking successfully'
                        );
                    } else {
                        this.isErrorCancelRules = true;
                        this.logService.error(
                            '~HistoryComponent~cancelBooking~cancelbooking failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.isErrorCancelRules = true;
                    this.logService.error(
                        '~HistoryComponent~cancelBooking~cancelbooking fetech error' +
                        err
                    );
                },

            });
    }

    bookingCancellationTerms() {
        let files = this.storeService.get("fileId", StoreType.LOCAL);
        this.restService
            .get(EndpointsConfig.cancelation.termAndcondition + files)
            .subscribe({
                next: (response) => {
                    this.termsandcondition.next(response);
                    this.logService.info(
                        '~HistoryComponent~showVenueTerms~showVenueTerms successfully'
                    );
                },
            });
    }

    getRefundAmount(bookingReference: string, venueId: number) {
        const cancel = {
            booking_reference: bookingReference,
            venue_id: venueId,
            header: new RequestHeader(),
        };
        this.restService
            .post(EndpointsConfig.cancelation.refundAmount, cancel)
            .subscribe({
                next: (response) => {
                    if (response.status.statusCode === '1001') {
                        this.cancellationAmount.next(response.cancel_transaction);
                        let details = response.cancel_transaction;
                        for (let tax of details.bookingAmount) {
                            // transaction amount  directly calculated
                            var sum = tax.bookingAmountTax.reduce((sum, item) => sum + item.taxAmount, 0);
                            let Total_Booking = tax.splitupAmount + sum;
                            let Fare = Total_Booking * details.totalSeats;
                            this.handlingCharges.push(Fare);

                        }
                        // refund amount  directly calculated
                        for (let refundAmount of details.cancelAmount) {

                            var sum = refundAmount.cancelAmountTax.reduce((sum, item) => sum + item.taxAmount, 0);
                            let sub_total = refundAmount.splitupAmount + sum;
                            let Total_tax = sub_total * details.totalSeats;
                            this.taxCharges.push(Total_tax);

                        }


                    } else {
                        this.logService.error(
                            '~HistoryComponent~cancelBooking~cancelbooking failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.isErrorRefundAmount = true;
                    this.logService.error(
                        '~HistoryComponent~cancelBooking~cancelbooking fetech error' +
                        err
                    );
                },
            });
    }

    cancelBooking(bookingReference: string, venueId: number) {
        const request = {
            booking_reference: bookingReference,
            venue_id: venueId,
            header: new RequestHeader(),
        };
        this.restService
            .post(EndpointsConfig.cancelation.cancelbooking, request)
            .subscribe({
                next: (response) => {
                    if (response.status.statusCode == '1001') {
                        this.isErrorCancelHistory = false;
                        this.logService.info(
                            '~HistoryComponent~cancelBooking~cancelbooking successfully'
                        );
                    } else if (response.status.statusCode == '1002') {
                        this.isErrorCancelHistory = true;

                    } else {
                        this.isErrorCancelHistory = true;
                        this.logService.error(
                            '~HistoryComponent~cancelBooking~cancelbooking failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.isErrorCancelHistory = true;
                    this.logService.error(
                        '~HistoryComponent~cancelBooking~cancelbooking fetech error' +
                        err
                    );
                },
                complete: () => {
                    this.getBookingHistory();
                },
            });
    }

    updatePrimaryNumber(user: User): any {
        const updateprofile = new updateProfileRequest();
        updateprofile.primaryPhoneNumber = user.primaryPhoneNumber;
        updateprofile.header = new RequestHeader();

        this.restService
            .post(EndpointsConfig.profile.update, updateprofile)
            .subscribe({
                next: (response) => {
                    this.updatedPrimaryNumber.next(response);
                },
                error: (err) => {
                    this.isErrorUpdateProfile = true;
                    this.logService.error(
                        '~EditProfileComponent~updateProfile~updateProfile fetech error' +
                        err
                    );
                },
            });
    }
}  
