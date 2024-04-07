import { Component, Input, OnInit} from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { UserService } from 'src/app/_shared/user/service/user.service';

import { ShowService } from '../../dashboard/service/show.service';
import { ModalService } from 'src/app/_core/service/modal.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/_shared/user/model/user';
import { formatDate } from '@angular/common';
import { LoginotpService } from '../../login/service/loginotp.service';


import * as _ from "lodash";
@Component({
    selector: 'mp-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    // Form
    enterOtp: boolean;
    profile: FormGroup;
    firstName: FormControl;
    lastName: FormControl;
    primaryPhoneNumber: FormControl;
    primaryEmail: FormControl;
    dateOfBirth: FormControl;
    gender: FormControl;
    updateNumber: string;
    user: User = new User();
    user1: User;
    timer: boolean;
    settimer: boolean;
    timeLeft: number;
    interval;
    submitted = false;
    errorMsg: String;
    isLoading = false;
    successMsg: string = "Profile Updated Successfully";
    successFlag =false;
    @Input()maxlength: string | number
    constructor(
        public profileService: ProfileService,
        public userService: UserService,
        public showService: ShowService,
        private modalService: ModalService,
        public loginotpService: LoginotpService,
        private formBuilder: FormBuilder,
    ) { }
    //only number will be add
    keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    ngOnInit(): void {
        // use form control
        (this.firstName = new FormControl('', [Validators.required])),
            (this.lastName = new FormControl('', [
                Validators.required,
            ]));

        this.primaryPhoneNumber = new FormControl('', [
            Validators.required,
            Validators.pattern('[6-9]\\d{9}'),
        ]);
        (this.primaryEmail = new FormControl('', [
            Validators.required,
            Validators.pattern(
                '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            ),
        ])),
            (this.dateOfBirth = new FormControl('', [
                Validators.required,
            ]));
        (this.gender = new FormControl('', [Validators.required])),
            (this.profile = this.formBuilder.group({
                firstName: this.firstName,
                lastName: this.lastName,
                primaryPhoneNumber: this.primaryPhoneNumber,
                primaryEmail: this.primaryEmail,
                dateOfBirth: this.dateOfBirth,
                gender: this.gender,
            }));

        this.userService.getUser().subscribe((users) => {
            this.user = users[0];
            this.setValues();
        });

    }

    setValues() {
        this.profile.setValue({
            firstName: this.user.firstName ? this.user.firstName : "",
            lastName: this.user.lastName ? this.user.lastName : "",
            primaryPhoneNumber: this.user.primaryPhoneNumber ? this.user.primaryPhoneNumber : "",
            primaryEmail: this.user.primaryEmail ? this.user.primaryEmail : "",
            dateOfBirth: this.user.dateOfBirth ? this.user.dateOfBirth : "",
            gender: this.user.gender ? this.user.gender : "",
        });

    }

    close() {
        this.modalService.hide();
    }
    simpleClone(user: User) {
        return Object.assign({}, user);
    }
    updateProfiles() {
        this.user1 = this.simpleClone(this.user);
        this.user1.firstName = this.profile.value.firstName;
        this.user1.lastName = this.profile.value.lastName;
        this.user1.dateOfBirth = formatDate(
            this.profile.value.dateOfBirth,
            'dd-MMM-yyyy',
            'en-US'
        );
        this.user1.gender = this.profile.value.gender;
        this.user1.primaryEmail = this.profile.value.primaryEmail;
        this.user1.primaryPhoneNumber = this.profile.value.primaryPhoneNumber;
        this.profileService.updateProfile(this.user1);
    }

    onSubmit() {
        this.successFlag = false;
        this.submitted = true;
        if (this.profile.valid) {
            this.updateNumber = this.user.primaryPhoneNumber;
            if (
                this.updateNumber ===
                this.profile.value.primaryPhoneNumber || this.updateNumber !==
                this.profile.value.primaryPhoneNumber
            ) {  
                this.isLoading = true;
                setTimeout(() => (this.isLoading = false), 4000);
                this.successFlag = true;
                this.updateProfiles();

            } else if (
                this.updateNumber !==
                this.profile.value.primaryPhoneNumber
            ) {
                if (
                    this.profile.value.primaryPhoneNumber ===
                    undefined ||
                    this.profile.value.primaryPhoneNumber === ''
                ) {
                    this.enterOtp = false;
                } else {
                    this.successFlag = false;
                    this.updateProfiles();
                }
            } else {

                this.user.firstName = this.profile.value.firstName;
                this.user.lastName = this.profile.value.lastName;
                this.user.dateOfBirth = formatDate(
                    this.profile.value.dateOfBirth,
                    'dd-MMM-yyyy',
                    'en-US'
                );
                this.user.gender = this.profile.value.gender;
                this.user.primaryEmail = this.profile.value.primaryEmail;
                this.user.primaryPhoneNumber = this.profile.value.primaryPhoneNumber;

            }
            this.errorMsg = this.successMsg;
        } else if (this.profile.invalid) {
            return;
        }
    }
    get f() {
        return this.profile.controls;
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.timeLeft = 30;
                clearInterval(this.interval);
                this.timer = true;
                this.settimer = false;
            }
        }, 1000);
    }
    closeButton() {
        this.submitted = false;
    }

}
