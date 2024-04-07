import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'mp-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private router: Router,) { }

  ngOnInit(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;

  }
  route() {
    this.router.navigate(['/']);
}
mailto(emailAddress: string, emailSubject: any) {
    return "mailto:" + emailAddress + "?subject=" + emailSubject
}
}         
            