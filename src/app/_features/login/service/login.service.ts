import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { EndpointsConfig } from 'src/app/_config/endpoints.config';
import { RestApiService } from 'src/app/_core/service/rest-api.service';
import { TokenStorage } from 'src/app/_core/guard/token-storage';
import { LogService } from 'src/app/_core/log/log.service';
import { RequestHeader } from 'src/app/_core/model/request-header';
import { User } from 'src/app/_shared/user/model/user';
import { UserService } from 'src/app/_shared/user/service/user.service';
import { CommonConstants } from 'src/app/_core/constants/common-constants.enum';
import { ProfileService } from '../../profile/service/profile.service';



@Injectable({
    providedIn: 'root',
})
export class LoginService {
    success = false;
    isErrorRegister = false;
    socialLoginIn = false;
    login = new ReplaySubject(1);
    refresh = new ReplaySubject(1);
    registers = new ReplaySubject(1);
    loginOtpsuccess = new ReplaySubject(1);
    varificationotp = new ReplaySubject(1);
    walletOtp = new ReplaySubject(1);
    isErrorLoginOtp = false;
    isErrorVerificationOtp = false;
    otpVerification: boolean;
    authenticateFlag: boolean;
    errormsg: boolean;
    constructor(
        private restService: RestApiService,
        private token: TokenStorage,
        private logService: LogService,
        private userService: UserService,
        private profileService: ProfileService,
    
    ) { }
    ngOnInit() {
        !this.authenticateFlag        }
    logIn(user: User): any {
        // this.user = user;
        user.header = new RequestHeader();
        this.restService
            .post(EndpointsConfig.user.login, user)
            .subscribe({
                next: (response) => {

                    this.token.saveToken(
                        response.token,
                        response.refreshToken
                    );
                    if (response.status.statusCode === '1001' || response.status.statusCode=== '2001') {
                        this.success = true;
                        this.errormsg = false;
                        this.login.next(response);
                        this.userService.delete(
                            CommonConstants.GUEST_USER
                        );
                        user.userId = user.userId;
                        user.isLoggedIn = true;
                        this.userService.add(user);
                        this.profileService.getProfile(user);

                    }
                    else if (response.status.statusCode === '3002') {
                        this.success = false;
                        this.errormsg = true;
                    } else if (response.status.statusCode === '3001') {
                        this.success = false;
                        this.errormsg = true;

                    }


                },
                error: (err) => {
                    this.success = false;
                    this.errormsg = true;
                    this.authenticateFlag = false;
                    this.logService.error(
                        '~LoginComponent~logIn~logIn fetech error' +
                        err
                    );
                },
            });
    }

    register(user: User): any {
        user.header = new RequestHeader();
        this.restService
            .post(EndpointsConfig.user.register, user)
            .subscribe({
                next: (response) => {

                    if (response.status.statusCode === '2001') {
                        this.isErrorRegister = true;
                        this.authenticateFlag = false;
                        this.registers.next(response);

                    }
                    else if (response.status.statusCode === '3002') {
                        this.isErrorRegister = false;
                        this.authenticateFlag = true;
                        this.errormsg = false;
                    } else if (response.status.statusCode === '3001') {
                        this.isErrorRegister = false;
                        this.authenticateFlag = true;
                        this.errormsg = false;
                    }


                },
                error: (err) => {
                    this.isErrorRegister = false;
                    this.logService.error(
                        '~LoginComponent~register~register fetech error' +
                        err
                    );
                },
                complete: () => {
                    if (this.isErrorRegister) {
                        const user1 = new User();
                        user1.userId = user.userId;
                        user1.passCode = user.password;
                        this.logIn(user1);
                    }
                },
            });
    }
    socialLogin(user: User): any {
        // this.user = user;
        user.header = new RequestHeader();
        this.restService
            .post(EndpointsConfig.user.socialRegistration, user)
            .subscribe({
                next: (response) => {
                    this.token.saveToken(
                        response.token,
                        response.refreshToken
                    );
                    
                    if (response.status.statusCode === '2001') {
                        this.socialLoginIn=true;
                        this.login.next(response);
                        this.userService.delete(
                            CommonConstants.GUEST_USER
                        );
                        user.userId = user.userId;
                        user.isLoggedIn = true;
                        this.userService.add(user);
                        this.profileService.getProfile(user);
                    } else {
                        this.socialLoginIn=false;
                        this.logService.error(
                            '~LoginComponent~socialLogin~socialLogin failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.socialLoginIn=false;
                    this.logService.error(
                        '~LoginComponent~socialLogin~socialLogin fetech error' +
                        err
                    );
                },

            });
    }
    intiateOtp(phoneNumber: string): any {
        const request = {
            // tslint:disable-next-line: object-literal-shorthand
            phoneNumber: phoneNumber,
            header: new RequestHeader(),
        };

        this.restService
            .post(EndpointsConfig.user.loginotp, request)
            .subscribe({
                next: (response) => {
                    if (response.status.statusCode === '2001') {
                        this.isErrorLoginOtp = true;
                        this.loginOtpsuccess.next(response);
                    } else {
                        this.logService.error(
                            '~LoginComponent~loginOtp~loginOtp failed response code ' +
                            response.status.statusCode +
                            'description' +
                            response.status.statusDescription
                        );
                    }
                },
                error: (err) => {
                    this.logService.error(
                        '~LoginComponent~loginOtp~loginOtp fetech error' +
                        err
                    );
                },
            });
    }
    async validationOtp(passCode: string, userId: string) {
        const request = {
            // tslint:disable-next-line: object-literal-shorthand
            passCode: passCode,
            // tslint:disable-next-line: object-literal-shorthand
            userId: userId,
            header: new RequestHeader(),
        };
        this.restService
            .post(EndpointsConfig.user.login, request)
            .subscribe({
                next: (response) => {
                    this.token.saveToken(
                        response.token,
                        response.refreshToken
                    );
                    if (
                        response.status.statusCode === '1001') {
                        this.isErrorVerificationOtp = true;
                        this.otpVerification = false;
                        this.varificationotp.next(response);
                        this.userService.delete(
                            CommonConstants.GUEST_USER
                        );
                        const user = new User();
                        user.userId = userId;
                        user.isLoggedIn = true;
                        this.userService.add(user);
                        this.profileService.getProfile(user);
                    } else if (response.status.statusCode === '3002') {
                        this.isErrorVerificationOtp = false;
                        this.otpVerification = true;
                    } else if (response.status.statusCode === '3001') {
                        this.isErrorVerificationOtp = false;
                        this.otpVerification = true;
                    }
                },
                error: (err) => {
                    this.isErrorVerificationOtp = false;
                    this.otpVerification = true;
                    this.logService.error(
                        '~LoginComponent~validationOtp~validationOtp fetech error' +
                        err
                    );
                },
            });
    }

    authenticateOtp(user: User): any {
        // this.user = user;
        user.header = new RequestHeader();
        this.restService
            .post(EndpointsConfig.user.login, user)
            .subscribe({
                next: (response) => {
                    this.walletOtp.next(response)
                    if (response.status.statusCode === '1001') {
                    }
                    else if (response.status.statusCode === '3002') {
                    }
                },
                error: (err) => {
                    this.success = false;
                    this.logService.error(
                        '~LoginComponent~logIn~logIn fetech error' +
                        err
                    );
                },
            });
    }


    refreshToken(){
      
         
      this.restService
            .post(EndpointsConfig.user.refreshToken,{
                header: new RequestHeader(),
              })
            .subscribe({
                next: (response) => {
                    this.token.saveToken(
                        response.token,
                       this.token.getRefreshToken()
                    );
                    this.refresh.next(response);
                   
                },
                error: (err) => {
                        this.logService.error(
                        '~LoginComponent~socialLogin~socialLogin fetech error' +
                        err
                    );
                },
            }); 

         
       
    }
}
