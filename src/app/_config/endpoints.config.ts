import { InjectionToken } from '@angular/core';

export let ENDPOINTS_CONFIG = new InjectionToken('endpoints.config');

export const EndpointsConfig: any = {
    user: {
        authenticate: '/api/v1/login/authenticate',
        login: '/user-service/api/rest/v1/user/authenticate',
        register: '/user-service/api/rest/v1/user/register',
        loginotp:
            '/user-service/api/rest/v1/user/authenticate/otp/initiate',
        validationotp:
            '/user-service/api/rest/v1/user/authenticate/otp/validation',
        socialRegistration:
            '/user-service/api/rest/v1/user/social/login',
        forgotpassword:
            '/user-service/api/rest/v1/user/password/reset/send/email',
        resetpasswordtoken:
            '/user-service/api/rest/v1/user/password/reset/validation/token',
        resetpassword:
            '/user-service/api/rest/v1/user/password/reset',
        refreshToken: '/api/rest/v1/auth/token',
    },
    moviedetails: {
        movietrailer:
            '/admin-service/api/rest/v1/manage-movies/get-movie-details',
        adduserreview:
            '/admin-service/api/rest/v1/manage-review/user/store',
        getrecommended:
            '/show-service/api/rest/v1/shows/recommended/movies',
        movieinfo:
            '/admin-service/api/rest/v2/movie/',
    },

    booking: {
        seatlayout:
            '/reservation-service/api/rest/v1/reservation/seatingRepresentation',
        seatblock:
            '/reservation-service/api/rest/v2/reservation/seat-block',
        unblockseatstatus: '/reservation-service/api/rest/v2/reservation/seat/booking/status',

        razorPayPayment: '/payment-web/api/rest/v1/razorpay/payment',
        cashFreePayment: '/payment-web/api/rest/v1/third-party',
        paymentRazorpay: '/payment-web/api/rest/v1/razorpay/redirect',
        walletpayment: '/payment-web/api/rest/v1/payment/wallet',
        resendnotification:
            '/reservation-service/api/rest/v2/reservation/resend-notification',
        walletgateway: '/payment-web/api/rest/v1/wallet/recharge',
        getwalletdetails: '/payment-web/api/rest/v1/wallet/details',
        paymentMode:
            '/reservation-service/api/rest/v2/reservation/payment-modes',
        faredetails:
            '/reservation-service/api/rest/v2/reservation/fare-details',
        getticketdetails:
            '/reservation-service/api/rest/v2/reservation/ticket-details',
        walletstatus: "/wallet-service/api/rest/v1/wallet/status",
        walletenrollment: "/wallet-service/api/rest/v1/wallet/enrolment",
        walletunenrollment: "/wallet-service/api/rest/v1/wallet/un-enrolment",
        walletrecharge: "/payment-web/api/rest/v1/wallet/recharge",
        wallettransactiondetails: "/wallet-service/api/rest/v1/wallet/transactions",
        getBookingHistoryDetails: "/reservation-service/api/rest/v2/booking/history/",

    },
    location: {
        viewlocation:
            '/admin-service/api/rest/v2/city/presence',
    },

    profile: {
        bookinghistory:
            '/reservation-service/api/rest/v2/booking/history',
        bookinghistoryInfo:
            '/reservation-service/api/rest/v2/booking/history',
        cancelbooking:
            '/reservation-service/api/rest/v1/reservation/booking/cancel',
        retrieve: '/user-service/api/rest/v1/user/profile/retrieve',
        update: '/user-service/api/rest/v1/user/profile/update',
    },
    cancelation: {
        cancelationrules:
            '/admin-service/api/rest/v1/manage-venues/cancelation-rule',
        refundAmount:
            '/reservation-service/api/rest/v2/booking/refund-calculation',
        termAndcondition: '/file-service/api/rest/v1/file/html/',
        cancelbooking:
            '/reservation-service/api/rest/v2/booking/cancellation',
    },
    preference: {
        fetchgenre:
            '/user-service/api/rest/v1/user/profile/fetch/preference/genre',
        addgenre:
            '/user-service/api/rest/v1/user/profile/add/preference/genre',
        deletegenre:
            '/user-service/api/rest/v1/user/profile/delete/preference/genre',
        fetchvenue:
            '/user-service/api/rest/v1/user/profile/fetch/preference/venue',
        addvenue:
            '/user-service/api/rest/v1/user/profile/add/preference/venue',
        deletevenue:
            '/user-service/api/rest/v1/user/profile/delete/preference/venue',
    },
    movie: {
        showdate: '/show-service/api/rest/v1/shows/fetch/showdates',
        showtime: '/show-service/api/rest/v1/shows/movie/show-times',
        fileidcontent: '/file-service/api/rest/v1/file/html/',
        genres:
            '/admin-service/api/rest/v1/manage-movies/get-all-genres',
        fetchlegends: '/show-service/api/rest/v1/shows/fetch/legends',
    },
    venue: {
        showdate: '/show-service/api/rest/v1/shows/fetch/venuedates',
        showtime: '/show-service/api/rest/v1/shows/venue/show-times',
        bycity:
            '/admin-service/api/rest/v1/manage-venues/city/venues',
        experiencebyvenue:
            '/admin-service/api/rest/v1/manage/venue/experiences',
    },
    logger: {
        log: '/api/v1/log',
    },
    show: {
        nowshowing: '/show-service/api/rest/v1/shows/now-showing',
        upcoming:
            '/admin-service/api/rest/v1/manage-movies/upcoming/movies',
    },
    subscribtion: {
        subscribe: '/user-service/api/rest/v1/user/subscribe',
    },
    getvenuebyid: {
        byvenue: '/admin-service/api/rest/v2/venue/',
    }
};
