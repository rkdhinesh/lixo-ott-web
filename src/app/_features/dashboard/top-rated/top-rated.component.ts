import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { ShowService } from '../service/show.service';

@Component({
  selector: "mp-top-rated",
  templateUrl: "./top-rated.component.html",
  styleUrls: ["./top-rated.component.scss"],
})
export class TopRatedComponent implements OnInit {
  topratedTrailer: any;
  movie: any;
  topratedmovies: any;
  constructor(private sanitizer: DomSanitizer, public showService: ShowService) { }

  ngOnInit(): void {
    this.showService.shows.subscribe((trailers) => {
      this.movie = trailers;
      this.navigateTrailer(this.movie[0].trailerUrl);
    });

  }


  navigateTrailer(trailer: any) {

    this.topratedTrailer = this.sanitizer.bypassSecurityTrustResourceUrl(
      trailer
    );

  }
}
