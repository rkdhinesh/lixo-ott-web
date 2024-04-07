import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShowService } from '../service/show.service';
import { ModalService } from 'src/app/_core/service/modal.service';
import { Router } from '@angular/router';
import { MovieStateService } from 'src/app/_shared/movie/service/movie-state.service';
import { BookingService } from 'src/app/_shared/booking/service/booking.service';
import { Booking } from 'src/app/_shared/booking/ model/booking';
import { MovieService } from '../../shows/service/movie.service';
import { Subscription } from 'rxjs';
import { IMovie } from '../../shows/model/movie';



@Component({
  selector: 'mp-dimension',
  templateUrl: './dimension.component.html',
  styleUrls: ['./dimension.component.scss']
})
export class DimensionComponent implements OnInit,OnDestroy {
  nowShowingMovies: any;
  city: string;
  movieDimension: any;
  booking:Booking;
  selectedMovie: any;
  choosenExperience:number = 0;
  subscription:Subscription =  new Subscription();
  constructor(public showService: ShowService,
    private router: Router, private modalService: ModalService,public movieStateService: MovieStateService,
    private bookingService: BookingService,
    private movieService:MovieService) 
    {
          this.bookingService.get().subscribe( (booking)=>{
            this.booking = booking
        });
    }

  ngOnInit(): void {
     this.movieStateService.getMovie(this.booking.movieId).subscribe( (movieObj) => {
         this.selectedMovie = movieObj[0];
     })
    console.log(this.selectedMovie);
  }

  async selectedMovieExp(choosenMovieId:number,choosenDimension:any){
    this.booking= {...this.booking, movieId: choosenMovieId};
    this.bookingService.update(this.booking); 
    let hel = choosenDimension;
    console.log("chosenMovieId:::::"+choosenMovieId+":::::"+hel);
    await this.movieService.getMovie(choosenMovieId);
    let sub =  this.movieStateService.getMovie(choosenMovieId).subscribe( (movieObj) => {
      console.log("movieObj[0]"+movieObj[0]);
      console.log(undefined === movieObj[0]);
      if(undefined === movieObj[0]){
        if(!this.movieService.isErrorFetchingMovieDeatils){
            this.movieService.movie.subscribe((movie:IMovie)=>{
              this.movieService.addMovieToStore(movie[0]);
              this.modalService.hide();
              this.router.navigate(["/shows"]);
          })
        }
      }
     })
     this.subscription.add(sub);




    
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  close(){
    this.modalService.hide();
  }


}
