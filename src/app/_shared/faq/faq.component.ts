import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mp-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  isHidden = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
 route(){
  this.router.navigate(['/']);
 }

}
