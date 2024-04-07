import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, Input, ViewChildren } from '@angular/core';
import { LoginService } from './service/login.service';
import { ModalService } from 'src/app/_core/service/modal.service';
import { User } from 'src/app/_shared/user/model/user';
import { ForgotPasswordService } from './service/forgot-password.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LogService } from 'src/app/_core/log/log.service';
import { PreferenceService } from '../profile/service/preference.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { environment } from "src/environments/environment";

@Component({
  selector: 'mp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public loginService: LoginService,
    private modalservice: ModalService,
    private forgotpassword: ForgotPasswordService,
    private logService: LogService,
    private preferenseService: PreferenceService,
    private prefernceService: PreferenceService,
    private formBuilder: FormBuilder,
    private authService: SocialAuthService
  ) {
    this.signForm = this.formBuilder.group(this.formInput);
  }
  showPassword: boolean;
  @Output() hidechange = new EventEmitter();
  @Output() isLoggedIn = new EventEmitter();
  @Input() modalRef: any;
  hideModal: any;
  header: any = 'Login to Lixo OTT';
  swithtoRegister: boolean;
  switchtoForgotPassword: boolean;
  showflag: boolean;
  // Form
  loginForm: FormGroup;
  email: FormControl;

  // Form Password
  passwordForm: FormGroup;
  password: FormControl;

  // Form control for Authenticate
  signForm: FormGroup;
  otp: FormControl;

  // forgotpassword Form
  forgotPasswordForm: FormGroup;
  emailPassword: FormControl;
  mailPassword: boolean;
  passwordOtp: boolean;
  timer: boolean;
  settimer: boolean;
  timeLeft: string = '60';
  interval;
  NewPassword: boolean;
  buttonFade: boolean;
  submitted = false;
  hideError: boolean = false;
  signIn: boolean = true;

  //google and facebook
  user: SocialUser;
  loggedIn: boolean;
  // otpLogin
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  @ViewChildren('formRow') rows: any;
  @ViewChild('clearInput') clearInput: ElementRef;
  title: string = '';
  verifynumber: string;
  toFormGroup(elements) {
    const group: any = {};

    elements.forEach((key) => {
      group[key] = new FormControl('', Validators.required);

      this.title = this.title + group[key];
    });
    return new FormGroup(group);
  }

  ngOnInit() {
    this.swithtoRegister = false;
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?:\d{10}|[_a-z0-9]+(\.[_a-z0-9]+)*@\w+\.\w{2,3})$/),
    ]);

    (this.password = new FormControl('', [Validators.required])),
      (this.emailPassword = new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
      ]));

    this.loginForm = this.formBuilder.group({
      email: this.email,
    });

    this.passwordForm = this.formBuilder.group({
      password: this.password,
    });

    this.signForm = this.toFormGroup(this.formInput);

    this.forgotPasswordForm = new FormGroup({
      emailPassword: this.emailPassword,
    });

 //  this.loginService.refreshToken();

    // // Account kit faceboook otp
    // AccountKit.init({
    //     appId: "401677290742402",keyUpEvent
    //     state: "c1844e62-2f28-47e3-a1f8-0f6e206c07da",
    //     version: "v1.1",
    // });
  }

  keyUpEvent(event, index) {
    let pos = index;

    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
  }
  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  close() {
    this.modalservice.hide(this.modalRef);
  }

  // Account kit faceboook otp

  // AccountkitLogin(): void {
  //     AccountKit.login("PHONE", {
  //         countryCode: "+91",
  //         phoneNumber: "8870689114",
  //     }).then(
  //         (response: AuthResponse) => this.logService.info(response),
  //         (error: any) => this.logService.error(error)
  //     );
  // }

  signInWithGoogle(): void {
    if (undefined === this.user || this.user === null) {
      // console.log("Google");
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => this.subscribeToSocialLogin(user));
      
    }
  }

  signInWithFB(): void {
    // console.log("Face book")
    if (undefined === this.user || this.user === null) {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => this.subscribeToSocialLogin(user));
    }
  }

  subscribeToSocialLogin(socialUser: any) {
    this.user = socialUser;
    const user = new User();
    user.emailVerified = true;
    user.firstName = this.user.firstName;
    user.lastName = this.user.lastName;
    user.locale = '';
    user.userId = this.user.id;
   // user.companyId = `${environment.companyId}`;
    user.primaryEmail = this.user.email;
    user.loginType = this.user.provider;
    user.profileImageUrl = this.user.photoUrl;
    this.loginService.socialLogin(user);
    this.loginService.login.subscribe(() => {
      if (this.loginService.socialLoginIn === true) {
        this.isLoggedIn.emit();
        this.modalservice.hide(this.modalRef);
        this.prefernceService.getPreferrdVenue();
        this.preferenseService.getPreferredGenre();
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.swithtoRegister) {
      if (this.passwordForm.valid && this.loginForm.valid) {
        const user = new User();
        user.userId = this.loginForm.value.email;
        user.password = this.passwordForm.value.password;
        user.companyId = `${environment.companyId}`;
        this.loginService.register(user);

        // tslint:disable-next-line: no-conditional-assignment
        this.loginService.registers.subscribe(() => {
          if (this.loginService.isErrorRegister === true) {
            this.isLoggedIn.emit();
            this.modalservice.hide(this.modalRef);
            this.preferenseService.getPreferredGenre();
            this.prefernceService.getPreferrdVenue();
          }
        });
      } else if (this.passwordForm.invalid) {
        return;
      }
    } else {
      if (this.passwordForm.valid && this.loginForm.valid) {
        const user = new User();
        user.companyId = `${environment.companyId}`;
        user.userId = this.loginForm.value.email;
        user.passCode = this.passwordForm.value.password;
        this.loginService.logIn(user);
        this.loginService.login.subscribe(() => {
          if (this.loginService.success === true) {
            this.isLoggedIn.emit();
            this.modalservice.hide(this.modalRef);
            this.prefernceService.getPreferrdVenue();
            this.preferenseService.getPreferredGenre();
            window.setTimeout(function(){window.location.reload()}, 1000);
          }
        });
      } else if (this.passwordForm.invalid) {
        return;
      }
    }

    this.timer = true;
  }

  // display password use eye icon
  toggleShowPassword() {
    if (this.showPassword === false) {
      this.showPassword = true;
    } else {
      this.showPassword = false;
    }
  }
  headerClose() {
    this.hideModal = true;
    this.hidechange.emit(this.hideModal);
  }
  loginorRegisterTitle(title: any) {
    if (title === 'register') {
      this.header = 'Create a new account';
      this.swithtoRegister = true;
      this.signIn = false;
this.hideError = true;
    } else if (title === 'forgotpass') {
      this.header = 'ForgotPassword';
      this.switchtoForgotPassword = true;
    } else if (title === 'login') {
      this.header = 'Login to Lixo OTT';
      this.loginService.authenticateFlag=false;
      this.swithtoRegister = false;
      this.signIn = true;
      this.hideError = true;
     
    }
  }

  displayPassword(inputValue: any) {
    if (!isNaN(inputValue)) {
      if (inputValue.length > 10) {
        this.mailPassword = true;
      } else if (inputValue.length < 11) {
        this.mailPassword = false;
        this.showflag = false;
      }
    } else {
      this.mailPassword = true;
      this.showflag = true;
    }
  }
  /// timer settime in login otp screen
  startTimer() {
  
    this.interval = setInterval(() => {
      var timeLeft = parseInt(this.timeLeft);
      if (timeLeft > 0) {
        timeLeft--;
        this.timeLeft = String(timeLeft);
        if (timeLeft < 10) {
          this.timeLeft = '0' + timeLeft;
        }
      } else {
        timeLeft = 30;
        this.timeLeft = String(timeLeft);
        clearInterval(this.interval);
        this.timer = true;
        this.settimer = false;
      }
    }, 1000);
  }
  forgotPassword() {
    
    if (this.forgotPasswordForm.valid) {
      const user = new User();
     // user.companyId = `${environment.companyId}`;
      user.emailId = this.forgotPasswordForm.value.emailPassword;
      this.forgotpassword.forgotPassword(user);
      this.forgotpassword.forgotpassword.subscribe((response: any)=>{
        if(response.status.statusCode === "3002") {
          this.NewPassword = false;
        } else if(this.forgotpassword.isErrorPassword = true){
          this.NewPassword = true;
        }     
      })
      
    }
    // this.NewPassword = true;
  }
  otpPhoneRegister() {
    this.logService.info('~login-modal component~otpphoneRegister method');
    if (!this.mailPassword) {
      this.logService.info('~LoginModalComponent~submit sign Login form Valid' + this.loginForm.valid);
      if (this.loginForm.valid) {
        const phone = this.loginForm.value.email;
        this.loginService.intiateOtp(phone);
        this.passwordOtp = true;
      }
    } else {
      this.onSubmit();
    }
    this.timer = false;
    this.settimer = true;
    this.startTimer();
  }

  otpTrigger() {
    this.logService.info('~login-modal component~otpTrigger method');
    if (!this.mailPassword) {
      this.logService.info('~LoginModalComponent~submit sign Login form Valid' + this.loginForm.valid);
      if (this.loginForm.valid) {
        const phone = this.loginForm.value.email;
        this.loginService.intiateOtp(phone);
        this.passwordOtp = true;
      }
    } else {
      this.onSubmit();
    }
    this.timer = false;
    this.settimer = true;
    this.startTimer();
  }
  errorMessages() {
    this.buttonFade = true;
  }

  async authenticateOtp() {
    this.submitted = true;
    this.verifynumber =
      this.signForm.value.input1 +
      this.signForm.value.input2 +
      this.signForm.value.input3 +
      this.signForm.value.input4 +
      this.signForm.value.input5 +
      this.signForm.value.input6;
    this.logService.info('~LoginModalComponent~authenticateOtp~');
    if (this.signForm.valid && this.loginForm.valid) {
      await this.loginService.validationOtp(this.verifynumber, this.loginForm.value.email);
      this.loginService.varificationotp.subscribe(() => {
        if (this.loginService.isErrorVerificationOtp === true) {
          this.modalservice.hide(this.modalRef);
          this.isLoggedIn.emit();
        }
      });
    } else if (this.signForm.invalid) {
      return;
    }
  }
  get form() {
    return this.signForm.controls;
  }
  clearSearchInput() {
    this.clearInput.nativeElement.value = '';
  }

  signup() {
    this.swithtoRegister = true;
    this.signIn = false;
  }

  signin() {
    this.swithtoRegister = false;
    this.signIn = true;
  }
}
