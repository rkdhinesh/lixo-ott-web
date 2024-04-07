import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'mp-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  navTab = "summary";

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;

  }
  route() {
    this.router.navigate(['/']);
  }

  switchTab(viewname: any) {
    if (viewname === 'summary') {
      console.log("summary");
      this.navTab = "summary";
    } if (viewname === 'criticReview') {
      console.log("criticReview");
      this.navTab = "criticReview";
    } if (viewname === 'userReview') {
      console.log("userReview");
      this.navTab = "userReview";
    }
  }
  mailto(emailAddress: string, emailSubject: any) {
    return "mailto:" + emailAddress + "?subject=" + emailSubject
}

}
