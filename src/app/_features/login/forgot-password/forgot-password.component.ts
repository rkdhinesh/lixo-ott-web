import { Component, OnInit } from "@angular/core";
import { User } from "src/app/_shared/user/model/user";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ConfirmedValidator } from "./confirmed.validator";
import { ForgotPasswordService } from "../service/forgot-password.service";
import { Router } from "@angular/router";
// import { TokenGuard } from 'src/app/_core/guard/token.guard';

@Component({
  selector: "mp-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotResetPasswordForm = new FormGroup({});
  password: FormControl;
  confirmpassword: FormControl;
  resetPasswordParam: any;
  submitted: boolean = false;
  constructor(
    public forgotPasswordService: ForgotPasswordService,
    private router: Router,
    private fb: FormBuilder,
    
  ) { }
  ngOnInit(): void {
    this.forgotPasswordService.resetPasswordToken();

    this.forgotResetPasswordForm = this.fb.group(
      {
        password: (["", [Validators.required]]),
        confirmpassword: (["", [Validators.required]]),
      },
      {
        validator: ConfirmedValidator("password", "confirmpassword"),
      }
    );
  }

  get f() {
    return this.forgotResetPasswordForm.controls;
  }

  forgotPasswordReset() {
    this.submitted = true;
    const user = new User();
    user.password = this.forgotResetPasswordForm.value.password;
    this.forgotPasswordService.resetPassword(user);
    this.forgotPasswordService.updatepassword.subscribe((response:any)=>{
      if(response.status.statusCode === "2001"){
        localStorage.clear();
        this.router.navigate(["/"]);
        // this.tokenGuard.canActivate();
       }
    })
  }

}
